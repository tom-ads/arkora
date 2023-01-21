import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Budget from 'App/Models/Budget'
import Task from 'App/Models/Task'
import TimeEntry from 'App/Models/TimeEntry'
import GetTimeSheetValidator from 'App/Validators/Timesheet/GetTimesheetValidator'
import { getDatesBetweenPeriod } from 'Helpers/date'
import { getTimeEntriesTotalMinutes } from 'Helpers/timer'
import { groupBy } from 'lodash'

export default class TimesheetController {
  public async index(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(GetTimeSheetValidator)

    try {
      const startDate = payload.start_date.toISO()
      const endDate = payload.end_date.toISO()

      const timesheet = await TimeEntry.getUserTimesheet(
        ctx.auth.user!,
        payload.start_date.toISODate(),
        payload.end_date.toISODate()
      )

      const [budgets, tasks] = await Promise.all([
        Budget.getBudgetsWithProjectFields(
          timesheet.map((entry) => entry.budgetId),
          'projects.name as project_name'
        ),
        Task.query().whereIn(
          'id',
          timesheet.map((entry) => entry.taskId)
        ),
      ])

      ctx.logger.info(
        `Retrieved timesheet for user(${ctx.auth.user?.id}) between ${startDate} - ${endDate}`
      )

      const groupTimesheet = groupBy(timesheet, 'date')
      const betweenDates = getDatesBetweenPeriod(payload.start_date, payload.end_date)

      return {
        total_minutes: getTimeEntriesTotalMinutes(timesheet),
        days: Array.from({ length: betweenDates.length }, (_, idx) => betweenDates[idx]).map(
          (day) => {
            const dayEntries = groupTimesheet[day.toISO()]

            return {
              day: day.toISODate(),
              total_minutes: getTimeEntriesTotalMinutes(dayEntries),
              entries:
                dayEntries?.map((entry) => {
                  const budget = budgets.find((budget) => budget.id === entry.budgetId)
                  const task = tasks.find((task) => task.id === entry.taskId)

                  return {
                    ...entry.serialize(),
                    budget: budget?.serialize(),
                    task: task?.serialize(),
                  }
                }) ?? [],
            }
          }
        ),
      }
    } catch (err) {
      ctx.logger.error(`Failed to retrieve timesheet for user(${ctx.auth.user?.id}) due to: ${err}`)
    }
  }
}
