import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TimeEntry, { BillableOptions } from 'App/Models/TimeEntry'
import IndexTimeEntryValidator from 'App/Validators/Entry/IndexTimeEntryValidator'
import { bind } from '@adonisjs/route-model-binding'
import UpdateEntryValidator from 'App/Validators/Entry/UpdateEntryValidator'
import Budget from 'App/Models/Budget'
import Task from 'App/Models/Task'
import UserRole from 'App/Enum/UserRole'

export default class TimeEntriesController {
  public async index(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(IndexTimeEntryValidator)

    // Members can only retrieve their own time entries
    if (ctx.auth.user!.role?.name === UserRole.MEMBER) {
      payload.members = [ctx.auth.user!.id]
    }

    const entries = await TimeEntry.getTimeEntries(ctx.organisation!.id, {
      projectId: payload.project_id,
      budgets: payload.budgets,
      tasks: payload.tasks,
      members: payload.members,
      startDate: payload.start_date,
      endDate: payload.end_date,
      billable: payload.billable as BillableOptions,
    })

    return entries.map((entry) => ({
      ...entry.serialize(),
      is_billable: Boolean(entry.$extras.is_billable),
    }))
  }

  @bind()
  public async view(ctx: HttpContextContract, entry: TimeEntry) {
    await ctx.bouncer.with('TimeEntryPolicy').authorize('view', entry)

    await Promise.all([entry.load('budget'), entry.load('task'), entry.load('user')])

    return entry.serialize()
  }

  @bind()
  public async update(ctx: HttpContextContract, entry: TimeEntry) {
    await ctx.bouncer.with('TimeEntryPolicy').authorize('update', entry)

    const payload = await ctx.request.validate(UpdateEntryValidator)

    const budget = await Budget.findOrFail(payload.budget_id ?? entry.budgetId)

    if (await ctx.bouncer.with('BudgetPolicy').allows('view', budget)) {
      if (payload.budget_id !== entry.budgetId) {
        await entry.related('budget').associate(budget)
        await entry.load('budget')
      }

      if (payload.task_id !== entry.taskId) {
        const task = await Task.findOrFail(payload.task_id ?? entry.taskId)
        await entry.related('task').associate(task)
        await entry.load('task')
      }
    }

    if (payload.date !== entry.date) {
      entry.date = payload.date
    }

    if (payload.description !== entry.description) {
      entry.description = payload.description ?? null
    }

    if (payload.estimated_minutes !== entry.estimatedMinutes) {
      entry.estimatedMinutes = payload.estimated_minutes ?? null
    }

    if (payload.duration_minutes !== entry.durationMinutes) {
      entry.durationMinutes = payload.duration_minutes
    }

    await entry.save()

    return entry.serialize()
  }

  /**
   * @route DELETE api/v1/entries/:entryId
   * @description Delete a specific time entry
   *
   * @successStatus 204 - No Content
   *
   * @errorResponse (401)  Unauthorized  Only authenticated users can delete an entry
   * @errorResponse (403)  Forbidden     Only admins can delete other team members entries
   */
  @bind()
  public async delete(ctx: HttpContextContract, entry: TimeEntry) {
    await ctx.bouncer.with('TimeEntryPolicy').authorize('delete', entry)

    await entry.delete()

    return ctx.response.noContent()
  }
}
