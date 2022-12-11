import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TimeEntry from 'App/Models/TimeEntry'
import GetTimeSheetValidator from 'App/Validators/Timesheet/GetTimesheetValidator'
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

      const groupedTimesheet = groupBy(
        timesheet.map((entry) => entry.serialize()),
        'date'
      )

      ctx.logger.info(
        `Retrieved timesheet for user(${ctx.auth.user?.id}) between ${startDate} - ${endDate}`
      )

      return groupedTimesheet
    } catch (err) {
      ctx.logger.error(`Failed to retrieve timesheet for user(${ctx.auth.user?.id}) due to: ${err}`)
    }
  }
}
