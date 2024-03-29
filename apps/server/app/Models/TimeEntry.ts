import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Budget from './Budget'
import Task from './Task'
import { timerDifference } from 'Helpers/timer'
import TimeSheetStatus from 'App/Enum/TimeSheetStatus'

export type BillableOptions = 'billable' | 'unbillable'

type EntriesFilters = Partial<{
  startDate: DateTime
  endDate: DateTime
  budgets: number[]
  projectId: number
  members: number[]
  tasks: number[]
  billable: BillableOptions
}>

type TimeEntryBuilder = ModelQueryBuilderContract<typeof TimeEntry>

export default class TimeEntry extends BaseModel {
  // Columns

  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public budgetId: number

  @column()
  public taskId: number

  @column.date()
  public date: DateTime

  @column()
  public description: string | null

  @column()
  public estimatedMinutes: number | null

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

  // Scopes

  public static filterDate = scope(
    (query: TimeEntryBuilder, startDate: DateTime | undefined, endDate: DateTime | undefined) => {
      const isoStartDate = startDate?.toISODate()
      const isoEndDate = endDate?.toISODate()

      if (isoStartDate && isoEndDate) {
        query.where('date', '>=', isoStartDate).where('date', '<=', isoEndDate)
      } else if (isoStartDate) {
        query.where('date', '>=', isoStartDate)
      } else if (isoEndDate) {
        query.where('date', '<=', isoEndDate)
      }
    }
  )

  public static forOrganisation = scope((query: TimeEntryBuilder, organisationId: number) => {
    query.join('users', (query) => {
      query
        .on('time_entries.user_id', '=', 'users.id')
        .andOnVal('users.organisation_id', organisationId)
    })
  })

  // Instance Methods

  public async stopTimer(this: TimeEntry) {
    const diffMinutes = timerDifference(this.lastStartedAt)
    this.durationMinutes += diffMinutes
    this.lastStoppedAt = DateTime.now()

    // Ensure updated duration does not exceed daily duration (23:59 -> 1439mins)
    if (this.isEntryDurationExceeded()) {
      this.durationMinutes = 1439
    }

    this.save()
  }

  public isEntryDurationExceeded() {
    // Duration cannot exceed 23:59 -> 1439 minutes
    return this.durationMinutes >= 1439
  }

  public async restartTimer(this: TimeEntry) {
    this.lastStartedAt = DateTime.now()
    this.lastStoppedAt = null
    this.save()
  }

  // Static Methods

  public static async getTimeEntries(organisationId: number, filters: EntriesFilters) {
    const result = await TimeEntry.query()
      .select('time_entries.*', 'tasks.is_billable')
      .whereHas('user', (query) => {
        query.where('organisation_id', organisationId)
      })
      .leftJoin('tasks', (subQuery) => {
        subQuery
          .on('time_entries.budget_id', '=', 'tasks.budget_id')
          .andOn('time_entries.task_id', '=', 'tasks.id')
      })
      .if(filters?.budgets, (query) => {
        query.whereIn('time_entries.budget_id', filters.budgets!)
      })
      .if(filters?.members, (query) => {
        query.whereIn('time_entries.user_id', filters.members!)
      })
      .if(filters?.projectId, (query) => {
        query.whereHas('budget', (budgetQuery) => {
          budgetQuery.where('project_id', filters.projectId!)
        })
      })
      .if(filters?.tasks, (query) => {
        query.whereIn('time_entries.task_id', filters.tasks!)
      })
      .if(filters.startDate || filters?.endDate, (query) => {
        query.withScopes((scopes) => scopes.filterDate(filters?.startDate, filters?.endDate))
      })
      .if(filters.billable, (query) => {
        query.where('tasks.is_billable', filters?.billable === 'billable')
      })
      .orderBy('time_entries.date', 'asc')
      .preload('user')
      .preload('budget')
      .preload('task')

    return result
  }

  public static async getTimesheets(
    organisationId: number,
    startDate: DateTime,
    endDate: DateTime,
    userId?: number
  ) {
    return await TimeEntry.query()
      .if(
        userId,
        (query) => query.where('user_id', userId!),
        (query) => query.withScopes((scopes) => scopes.forOrganisation(organisationId))
      )
      .withScopes((scopes) => scopes.filterDate(startDate, endDate))
      .orderBy('time_entries.date', 'asc')
      .preload('budget', (query) => query.preload('project'))
      .preload('task')
  }

  public static async getUserTimesheet(userId: number, startDate: string, endDate: string) {
    return await TimeEntry.query()
      .where('user_id', userId)
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .orderBy('date', 'asc')
      .preload('budget', (query) => query.preload('project'))
      .preload('task')
  }

  public static async getLastTimer(userId: number) {
    return await TimeEntry.query().where('user_id', userId).orderBy('created_at', 'desc').first()
  }

  public static async getOrganisationTimers(organisationId: number) {
    return await TimeEntry.query()
      .select('*')
      .join('time_entries', 'users.id', '=', 'time_entries.user_id')
      .where('users.organisation_id', organisationId)
      .whereNull('last_stopped_at')
      .orderBy('users.name')
      .groupBy('time_entries.id')
      .exec()
  }
}
