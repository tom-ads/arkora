import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserRole from 'App/Enum/UserRole'
import TimeEntry, { BillableOptions } from 'App/Models/TimeEntry'
import IndexTimeEntryValidator from 'App/Validators/Entry/IndexTimeEntryValidator'

export default class TimeEntriesController {
  public async index(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(IndexTimeEntryValidator)

    // Members can only retrieve their own time entries
    if (ctx.auth.user!.role?.name === UserRole.MEMBER) {
      payload.user_id = ctx.auth.user!.id
    }

    const entries = await TimeEntry.getTimeEntries(ctx.organisation!.id, {
      projectId: payload.project_id,
      budgetId: payload.budget_id,
      taskId: payload.task_id,
      userId: payload.user_id,
      startDate: payload.start_date,
      endDate: payload.end_date,
      billable: payload.billable as BillableOptions,
    })

    return entries.map((entry) => ({
      ...entry.serialize(),
      is_billable: Boolean(entry.$extras.is_billable),
    }))
  }
}
