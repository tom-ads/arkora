import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TimeSheetStatus from 'App/Enum/TimeSheetStatus'
import Budget from 'App/Models/Budget'
import Task from 'App/Models/Task'
import CreateTimeEntryValidator from 'App/Validators/Timer/CreatTimeEntryValidator'
import { DateTime } from 'luxon'

// create will create a new time entry
// start will start an existing timer /timers/:id/start
// end will stop an existing timer /timers/:id/stop

export default class TimerController {
  public async create(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateTimeEntryValidator)

    const [budget, task] = await Promise.all([
      Budget.findOrFail(payload.budget_id),
      Task.findOrFail(payload.task_id),
    ])

    await ctx.bouncer.with('BudgetsPolicy').authorize('view', budget)

    // Todo: prevent timers after a certain point

    const currentTimer = await ctx.auth.user!.getActiveTimer()
    if (currentTimer) {
      await currentTimer.deactivateTimer()
    }

    const timeEntry = await ctx.auth.user!.related('timeEntries').create({
      date: payload.date,
      description: payload.description,
      durationMinutes: payload?.duration_minutes ?? 0,
      estimatedMinutes: payload?.estimated_minutes ?? 0,
      lastStartedAt: DateTime.now(),
      status: TimeSheetStatus.PENDING,
    })
    await Promise.all([
      timeEntry.related('budget').associate(budget),
      timeEntry.related('task').associate(task),
    ])

    return {
      ...timeEntry.serialize(),
      last_stopped_at: null,
      description: timeEntry.description ?? null,
    }
  }
}
