import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Budget from './Budget'
import Task from './Task'
import { timerDifference } from 'Helpers/timer'
import TimeSheetStatus from 'App/Enum/TimeSheetStatus'

export default class TimeEntry extends BaseModel {
  // Columns

  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public userId: number

  @column({ serializeAs: null })
  public budgetId: number

  @column({ serializeAs: null })
  public taskId: number

  @column.date()
  public date: DateTime

  @column()
  public description: string | null

  @column()
  public estimatedMinutes: number

  @column()
  public durationMinutes: number

  @column.dateTime()
  public lastStartedAt: DateTime

  // This column is used to determine whether it is an active timer
  @column.dateTime()
  public lastStoppedAt: DateTime | null

  @column()
  public status: TimeSheetStatus

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  // Relations

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Budget)
  public budget: BelongsTo<typeof Budget>

  @belongsTo(() => Task)
  public task: BelongsTo<typeof Task>

  // Methods

  public async deactivateTimer() {
    const diffMinutes = timerDifference(this.lastStartedAt)
    this.durationMinutes += diffMinutes
    this.lastStoppedAt = DateTime.now()
    this.save()
  }

  public async restartTimer() {
    this.lastStartedAt = DateTime.now()
    this.lastStoppedAt = null
    this.save()
  }

  public static async getTimesheet(user: User, startDate: string, endDate: string) {
    let result = await TimeEntry.query()
      .where('user_id', user.id)
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .orderBy('date', 'asc')
      .exec()

    return result
  }
}
