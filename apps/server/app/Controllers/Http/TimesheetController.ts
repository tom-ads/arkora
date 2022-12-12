import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
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

      const timesheet = await TimeEntry.getTimesheet(
        ctx.auth.user!,
        payload.start_date.toISODate(),
        payload.end_date.toISODate()
      )

      ctx.logger.info(
        `Retrieved timesheet for user(${ctx.auth.user?.id}) between ${startDate} - ${endDate}`
      )

      const timesheetGrouped = groupBy(timesheet, 'date')
      const betweenDates = getDatesBetweenPeriod(payload.start_date, payload.end_date)

      return {
        total_minutes: getTimeEntriesTotalMinutes(timesheet),
        days: Array.from({ length: betweenDates.length }, (_, idx) => betweenDates[idx]).map(
          (day) => {
            const dayEntries = timesheetGrouped[day.toISO()]
            return {
              day: day.toISODate(),
              total_minutes: getTimeEntriesTotalMinutes(dayEntries),
              entries: dayEntries?.map((entry) => entry.serialize()) ?? [],
            }
          }
        ),
      }
    } catch (err) {
      ctx.logger.error(`Failed to retrieve timesheet for user(${ctx.auth.user?.id}) due to: ${err}`)
    }
  }
}
