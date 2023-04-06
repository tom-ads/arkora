import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TimeEntry from 'App/Models/TimeEntry'
import User from 'App/Models/User'
import GetTimesheetsValidator from 'App/Validators/Timesheet/GetTimesheetsValidator'
import GetTimeSheetValidator from 'App/Validators/Timesheet/GetTimesheetValidator'
import { groupBy } from 'lodash'

export default class TimesheetController {
  public async index(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(GetTimesheetsValidator)

    const timesheets = await TimeEntry.getTimesheets(
      ctx.organisation!.id,
      payload.start_date,
      payload.end_date
    )

    const serialised = timesheets.map((entry) => entry.serialize())

    return groupBy(serialised, (e) => e.user_id)
  }

  @bind()
  public async view(ctx: HttpContextContract, user: User) {
    const payload = await ctx.request.validate(GetTimeSheetValidator)

    const timesheet = await TimeEntry.getUserTimesheet(
      user.id,
      payload.start_date.toISODate(),
      payload.end_date.toISODate()
    )

    return timesheet.map((entry) => entry.serialize())
  }
}
