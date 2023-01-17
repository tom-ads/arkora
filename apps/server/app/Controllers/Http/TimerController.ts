import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TimeSheetStatus from 'App/Enum/TimeSheetStatus'
import Budget from 'App/Models/Budget'
import Task from 'App/Models/Task'
import TimeEntry from 'App/Models/TimeEntry'
import CreateTimeEntryValidator from 'App/Validators/Timer/CreateTimeEntryValidator'
import StartTimerValidator from 'App/Validators/Timer/StartTimerValidator'
import StopTimerValidator from 'App/Validators/Timer/StopTimerValidator'
import { DateTime } from 'luxon'

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
      ctx.logger.info(`Create Timer: stopped active timer for user(${ctx.auth.user!.id})`)
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

    ctx.logger.info(`Create Timer: created new time entry for user(${ctx.auth.user!.id})`)

    return {
      ...timeEntry?.serialize(),
      last_stopped_at: null,
      description: timeEntry.description ?? null,
    }
  }

  public async startTimer(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(StartTimerValidator)

    const timeEntry = await TimeEntry.findOrFail(payload.timer_id)

    await ctx.bouncer.with('TimeEntryPolicy').authorize('update', timeEntry)

    // Deactivate any related timer to timeEntry user
    await timeEntry.load('user')
    const activeTimer = await timeEntry.user.getActiveTimer()
    if (activeTimer) {
      try {
        await activeTimer.deactivateTimer()
      } catch (err) {
        ctx.logger.error(
          `Failed to stop timer for user(${ctx.auth.user!.id}) due to: ${err.message}`
        )
        return ctx.response.internalServerError()
      }
    }

    // Restart timer
    await timeEntry.restartTimer()
    await timeEntry.refresh()

    return {
      ...timeEntry?.serialize(),
      last_stopped_at: null,
      description: timeEntry.description ?? null,
    }
  }

  public async stopTimer(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(StopTimerValidator)

    let timeEntry: TimeEntry | null | undefined
    if (!payload.timer_id) {
      const activeTimer = await ctx.auth.user!.getActiveTimer()
      if (!activeTimer) ctx.response.notFound()
      timeEntry = activeTimer
    }

    // Only organisation admins can update a time entry directly with the timer_id
    if (!timeEntry) {
      timeEntry = await TimeEntry.findOrFail(payload.timer_id)
      await ctx.bouncer.with('TimeEntryPolicy').authorize('update', timeEntry)
    }

    // Attempt to stop active timer
    try {
      await timeEntry.deactivateTimer()
      ctx.logger.info(`Timer has been stopped for user(${ctx.auth.user!.id})`)
    } catch (err) {
      ctx.logger.error(`Failed to stop timer for user(${ctx.auth.user!.id}) due to: ${err.message}`)
      return ctx.response.internalServerError()
    }

    return ctx.response.noContent()
  }
}
