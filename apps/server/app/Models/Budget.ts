import { DateTime } from 'luxon'
import {
  afterCreate,
  BaseModel,
  beforeFetch,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  computed,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import Project from './Project'
import BudgetType from './BudgetType'
import User from './User'
import Task from './Task'
import TimeEntry from './TimeEntry'
import BillableType from './BillableType'
import Database from '@ioc:Adonis/Lucid/Database'

type BudgetBuilder = ModelQueryBuilderContract<typeof Budget>

export default class Budget extends BaseModel {
  // Fields

  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public projectId: number

  @column({ serializeAs: null })
  public budgetTypeId: number

  @column({ serializeAs: null })
  public billableTypeId: number | null

  @column()
  public name: string

  @column()
  public colour: string

  @column()
  public hourlyRate: number | null

  @column()
  public budget: number

  @column()
  public fixedPrice: number | null

  @column({ serialize: Boolean })
  public private: boolean

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  // Computed

  @computed()
  public get totalSpent() {
    return parseInt(this.$extras.total_spent ?? 0, 10)
  }

  @computed()
  public get totalRemaining() {
    return (this.fixedPrice ? this.fixedPrice : this.budget) - this.totalSpent
  }

  @computed()
  public get totalBillable() {
    return parseInt(this.$extras.total_billable ?? 0, 10)
  }

  @computed()
  public get totalNonBillable() {
    return parseInt(this.$extras.total_non_billable ?? 0, 10)
  }

  // Relations - belongsTo

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @belongsTo(() => BudgetType, { serializeAs: 'budget_type' })
  public budgetType: BelongsTo<typeof BudgetType>

  @belongsTo(() => BillableType)
  public billableType: BelongsTo<typeof BillableType>

  // Relations - manyToMany

  @manyToMany(() => User, {
    pivotTable: 'budget_members',
  })
  public members: ManyToMany<typeof User>

  @manyToMany(() => Task, {
    pivotTable: 'budget_tasks',
    pivotColumns: ['is_billable'],
  })
  public tasks: ManyToMany<typeof Task>

  // Relations - hasMany

  @hasMany(() => TimeEntry)
  public timeEntries: HasMany<typeof TimeEntry>

  // Hooks

  @beforeFind()
  @beforeFetch()
  public static beforePreloads(query: BudgetBuilder) {
    query.preload('budgetType').preload('billableType')
  }

  @afterCreate()
  public static async afterPreloads(budget: Budget) {
    await budget.load('budgetType')
    if (budget.billableTypeId) {
      await budget.load('billableType')
    }
  }

  // Scopes

  public static relatedMember = scope((query: BudgetBuilder, userId: number) => {
    return query.whereHas('members', (budgetBuilder) => {
      budgetBuilder.where('user_id', userId)
    })
  })

  // Methods - Static

  /*
    This method returns a total_spent field for each specified budget, where each budget can have
    zero to many linked time entries where their task_id is related to a billable task. These
    TimeEntries contain a durationMinutes field, which we can use to determine the total number of
    hours used, and thus multiplied by the hourly_rate set on each budget, giving us the total
    expenditure.

    Does cover
    - Time entries that have task/budget pivot record is_billable flag set to true, will
      return only those time entries.

    Does not cover:
    - Active timers durations won't have been added to the TimeEntries durationMinutes, so these
      are not included in the output total_spent for each budget.
  */
  public static async getBudgetsMetrics(budgetIds: number[]) {
    const result = await Budget.query()
      .select(
        'budgets.*',
        Database.raw(
          'IFNULL(ROUND(SUM(time_entries.duration_minutes) / 60, 2), 0) * budgets.hourly_rate AS total_spent'
        ),
        Database.raw(
          'SUM(CASE WHEN budget_tasks.is_billable = true THEN IFNULL(ROUND(time_entries.duration_minutes / 60, 2), 0) * budgets.hourly_rate ELSE 0 END) AS total_billable'
        ),
        Database.raw(
          'SUM(CASE WHEN budget_tasks.is_billable = false THEN IFNULL(ROUND(time_entries.duration_minutes / 60, 2), 0) * budgets.hourly_rate ELSE 0 END) AS total_non_billable'
        )
      )
      .whereIn('budgets.id', budgetIds)
      .leftJoin('time_entries', 'budgets.id', '=', 'time_entries.budget_id')
      .leftJoin('budget_tasks', (sub) => {
        sub
          .on('time_entries.task_id', '=', 'budget_tasks.task_id')
          .andOn('time_entries.budget_id', '=', 'budget_tasks.budget_id')
      })
      .groupBy('budgets.id')
      .orderBy('budgets.name')

    return result
  }
}
