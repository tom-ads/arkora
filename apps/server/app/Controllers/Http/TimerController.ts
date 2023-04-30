import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TimeSheetStatus from 'App/Enum/TimeSheetStatus'
import Budget from 'App/Models/Budget'
import Task from 'App/Models/Task'
import TimeEntry from 'App/Models/TimeEntry'
import CreateTimerValidator from 'App/Validators/Timer/CreateTimerValidator'
import StopTimerValidator from 'App/Validators/Timer/StopTimerValidator'
import { bind } from '@adonisjs/route-model-binding'
import { DateTime } from 'luxon'
import ProjectStatus from 'App/Enum/ProjectStatus'

export default class TimerController {
  /**
   * @route POST api/v1/timers
   * @description Create a new time entry / timer
   *
   * @requestBody {number} budget_id
   * @requestBody {number} tas_id
   * @requestBody {DateTime} date
   * @requestBody {optional string} description
   * @requestBody {optional number} duration_minutes
   * @requestBody {optional number} estimated_minutes
   *
   * @successStatus 200 - OK
   * @successResponse {TimeEntry} Restarted timer
   *
   * @errorResponse (401)  Unauthorized          Only authenticated users can create a timer
   * @errorResponse (403)  Forbidden             Only related team members to budget can start a timer
   * @errorResponse (422)  UnprocessableEntity   Only valid payloads can be used to create a timer
   */
  public async create(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateTimerValidator)

    const [budget, task] = await Promise.all([
      Budget.findOrFail(payload.budget_id),
      Task.findOrFail(payload.task_id),
    ])

    await ctx.bouncer.with('BudgetPolicy').authorize('view', budget)

    await budget.load('project')

    if (budget?.project?.status !== ProjectStatus.ACTIVE) {
      return ctx.response.badRequest({ message: 'Only active projects can be tracked against' })
    }

    const currentTimer = await ctx.auth.user!.getActiveTimer()
    if (currentTimer) {
      await currentTimer.stopTimer()
      ctx.logger.info(`Create Timer: stopped active timer for user(${ctx.auth.user!.id})`)
    }

    let createdEntry: TimeEntry
    try {
      createdEntry = await ctx.auth.user!.related('timeEntries').create({
        budgetId: budget.id,
        taskId: task.id,
        date: payload.date,
        description: payload.description,
        durationMinutes: payload?.duration_minutes ?? 0,
        estimatedMinutes: payload?.estimated_minutes ?? 0,
        lastStartedAt: DateTime.now(),
        status: TimeSheetStatus.PENDING,
      })
      ctx.logger.info(`Create Timer: created new time entry for user(${ctx.auth.user!.id})`)
    } catch (err) {
      ctx.logger.error(
        `Failed to create timer for user(${ctx.auth.user!.id}) due to: ${err.message}`
      )
      return ctx.response.internalServerError()
    }

    return {
      ...createdEntry?.serialize(),
      last_stopped_at: null,
      description: createdEntry.description ?? null,
    }
  }

  /**
   * @route GET api/v1/timers
   * @description Get a list of team member(s) active / inactive timers
   *
   * @successStatus 200 - OK
   * @successResponse {TimeEntry[]} List of active / inactive timers
   *
   * @errorResponse (401)  Unauthorized          Only authenticated users can index timers
   * @errorResponse (403)  Forbidden             Only admins can index timers
   */
  public async index(ctx: HttpContextContract) {
    await ctx.bouncer.with('TimeEntryPolicy').authorize('index')

    const organisationTeam = await ctx
      .organisation!.related('users')
      .query()
      .where((query) => {
        query.whereNot('id', ctx.auth.user!.id).whereNotNull('verifiedAt')
      })
      .orderBy('lastname', 'asc')

    const result = await Promise.all(
      organisationTeam.map(async (member) => {
        const activeTimer = await member.getActiveTimer()

        return {
          ...member.serialize(),
          timer: activeTimer?.serialize() ?? null,
        }
      })
    )

    return result
  }

  /**
   * @route PUT api/v1/timers/start
   * @description Starts a specific timer
   *
   * @requestBody {number} timer_id
   *
   * @successStatus 200 - OK
   * @successResponse {TimeEntry} Restarted timer
   *
   * @errorResponse (401)  Unauthorized          Only authenticated users can start a timer
   * @errorResponse (403)  Forbidden             Only admins can start other team members timers
   * @errorResponse (404)  Not Found             Only existing time entries can be started
   * @errorResponse (422)  UnprocessableEntity   Only valid timers can be started
   */
  @bind()
  public async startTimer(ctx: HttpContextContract, entry: TimeEntry) {
    await ctx.bouncer.with('TimeEntryPolicy').authorize('update', entry)

    const entryBudget = await entry.related('budget').query().preload('project').first()
    if (entryBudget?.project?.status !== ProjectStatus.ACTIVE) {
      return ctx.response.badRequest({ message: 'Only active projects can be tracked against' })
    }

    await entry.load('user')

    // Deactivate any related timer to timeEntry user
    const activeTimer = await entry.user.getActiveTimer()
    if (activeTimer) {
      try {
        await activeTimer.stopTimer()
      } catch (err) {
        ctx.logger.error(
          `Failed to stop timer for user(${ctx.auth.user!.id}) due to: ${err.message}`
        )
        return ctx.response.internalServerError()
      }
    }

    // Check entry has not already exceeded the daily duration
    if (entry.isEntryDurationExceeded()) {
      return ctx.response.unprocessableEntity({
        message: 'This time entry has reached the daily 24hr limit',
      })
    }

    // Restart timer
    await entry.restartTimer()
    await entry.refresh()

    return {
      ...entry?.serialize(),
      last_stopped_at: null,
      description: entry.description ?? null,
    }
  }

  /**
   * @route PUT api/v1/timers/stop
   * @description Stops an active timer
   *
   * @requestBody {optional number} timer_id
   *
   * @successStatus 204 - No Content
   *
   * @errorResponse (401)  Unauthorized  Only authenticated users can stop a timer
   * @errorResponse (403)  Forbidden     Only admins can stop other team members timers
   * @errorResponse (404)  Not Found     Only active timers can be stopped
   */
  public async stopTimer(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(StopTimerValidator)

    let timeEntry: TimeEntry | null = null
    if (!payload.timer_id) {
      const activeTimer = await ctx.auth.user!.getActiveTimer()
      if (!activeTimer) {
        return ctx.response.notFound()
      }
      timeEntry = activeTimer
    }

    // Only organisation admins can update a time entry directly with the timer_id
    if (!timeEntry) {
      timeEntry = await TimeEntry.findOrFail(payload.timer_id)
      await ctx.bouncer.with('TimeEntryPolicy').authorize('update', timeEntry)
    }

    // Attempt to stop active timer
    try {
      await timeEntry.stopTimer()
      ctx.logger.info(`Timer has been stopped for user(${ctx.auth.user!.id})`)
    } catch (err) {
      ctx.logger.error(`Failed to stop timer for user(${ctx.auth.user!.id}) due to: ${err.message}`)
      return ctx.response.internalServerError()
    }

    return ctx.response.noContent()
  }
}
