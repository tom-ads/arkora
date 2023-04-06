import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { bind } from '@adonisjs/route-model-binding'
import Organisation from 'App/Models/Organisation'
import UpdateOrganisationValidator from 'App/Validators/Organisation/UpdateValidator'
import Currency from 'App/Models/Currency'
import WorkDay from 'App/Models/WorkDay'

export default class OrganisationController {
  @bind()
  public async update(ctx: HttpContextContract, organisation: Organisation) {
    await ctx.bouncer.with('OrganisationPolicy').authorize('update', organisation)

    const payload = await ctx.request.validate(UpdateOrganisationValidator)

    organisation.merge({
      name: payload.name,
      openingTime: payload.opening_time,
      closingTime: payload.closing_time,
      defaultRate: payload.default_rate,
      breakDuration: payload.break_duration,
    })

    if (payload.currency !== organisation?.currency?.name) {
      const currency = await Currency.findBy('name', payload.currency)
      if (currency) {
        await organisation.related('currency').associate(currency)
        await organisation.load('currency')
      }
    }

    const persistedWorkDays = await WorkDay.all()
    const pendingWorkDayIds = persistedWorkDays
      .filter((workDay) => payload.business_days.some((day) => workDay.name === day))
      ?.map((workDay) => workDay.id)

    await Promise.all([
      organisation.related('workDays').sync(pendingWorkDayIds),
      organisation.related('commonTasks').query().delete(),
      organisation.related('commonTasks').createMany(payload.default_tasks),
      organisation.save(),
    ])

    await organisation.load('commonTasks')
    await organisation.load('workDays')

    return organisation.serialize()
  }

  @bind()
  public async delete(ctx: HttpContextContract, organisation: Organisation) {
    await ctx.bouncer.with('OrganisationPolicy').authorize('delete', organisation)

    try {
      await organisation.delete()
      ctx.logger.info(`Removed tenant(${organisation.id}) from the system`)
    } catch (err) {
      ctx.logger.error(`Failed to remove tenant(${organisation.id}), due to: ${err.message}`)
      return ctx.response.internalServerError()
    }

    return ctx.response.noContent()
  }
}
