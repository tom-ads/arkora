import { DateTime } from 'luxon'
import {
  afterCreate,
  BaseModel,
  beforeDelete,
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
import BudgetKind from 'App/Enum/BudgetKind'
import BillableKind from 'App/Enum/BillableKind'

type BudgetFilters = Partial<{
  page: number
}>

type BudgetBuilder = ModelQueryBuilderContract<typeof Budget>

export default class Budget extends BaseModel {
  // Fields

  @column({ isPrimary: true })
  public id: number

  @column()
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

  @column({ serializeAs: null })
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

  @computed({ serializeAs: 'total_cost' })
  public get totalCost() {
    // Non-billable budgets, do not have cost involved.
    if (this.budgetType.name === BudgetKind.NON_BILLABLE) {
      return
    }

    // Budget cost is the fixed price
    if (this.budgetType.name === BudgetKind.FIXED) {
      return this.fixedPrice
    }

    if (this.billableType?.name) {
      // Hour based budgets need to calc total cost using: total_hours * rate
      if (
        this.budgetType.name === BudgetKind.VARIABLE &&
        this.billableType.name === BillableKind.TOTAL_HOURS
      ) {
        return (this.budget / 60) * ((this.hourlyRate ?? 0) / 100)
      }
    }

    return this.budget
  }

  @computed({ serializeAs: 'total_minutes' })
  public get totalMinutes() {
    if (this.hourlyRate) {
      if (
        this.budgetType.name === BudgetKind.FIXED &&
        this.billableType.name === BillableKind.TOTAL_COST
      ) {
        return Math.round(Math.abs((this.fixedPrice ?? 0) / this.hourlyRate)) * 60
      }

      if (
        this.budgetType.name === BudgetKind.VARIABLE &&
        this.billableType?.name === BillableKind.TOTAL_COST
      ) {
        return Math.round(Math.abs(this.budget / this.hourlyRate)) * 60
      }
    }

    return this.budget
  }

  @computed({ serializeAs: 'total_spent' })
  public get totalSpent() {
    if (this.budgetType?.name === BudgetKind.NON_BILLABLE) {
      return
    }

    return parseInt(this.$extras.total_spent ?? 0, 10)
  }

  @computed({ serializeAs: 'total_remaining' })
  public get totalRemaining() {
    if (this.budgetType?.name === BudgetKind.NON_BILLABLE) {
      return
    }

    if (
      this.budgetType?.name === BudgetKind.VARIABLE &&
      this.billableType?.name === BillableKind.TOTAL_HOURS
    ) {
      return this.totalCost! - this.totalSpent!
    }

    return (this.fixedPrice ? this.fixedPrice : this.budget) - this.totalSpent!
  }

  @computed({ serializeAs: 'total_billable' })
  public get totalBillable() {
    if (this.budgetType?.name === BudgetKind.NON_BILLABLE) {
      return
    }

    return parseInt(this.$extras.total_billable ?? 0, 10)
  }

  @computed({ serializeAs: 'total_billable_minutes' })
  public get totalBillableMinutes() {
    if (this.budgetType?.name === BudgetKind.NON_BILLABLE) {
      return
    }

    return parseInt(this.$extras.total_billable_minutes ?? 0, 10)
  }

  @computed({ serializeAs: 'total_non_billable' })
  public get totalNonBillable() {
    if (this.budgetType?.name === BudgetKind.NON_BILLABLE) {
      return
    }

    return parseInt(this.$extras.total_non_billable ?? 0, 10)
  }

  @computed({ serializeAs: 'total_non_billable_minutes' })
  public get totalNonBillableMinutes() {
    if (this.budgetType?.name === BudgetKind.NON_BILLABLE) {
      return
    }
    return parseInt(this.$extras.total_non_billable_minutes ?? 0, 10)
  }

  // Relations - belongsTo

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @belongsTo(() => BudgetType, { serializeAs: 'budget_type' })
  public budgetType: BelongsTo<typeof BudgetType>

  @belongsTo(() => BillableType, { serializeAs: 'billable_type' })
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

  @beforeDelete()
  public static async beforeDelete(budget: Budget) {
    // TODO: use onDelete('cascade') instead on db
    await Promise.all([
      budget.related('members').detach(),
      budget.related('timeEntries').query().delete(),
      budget.related('tasks').detach(),
    ])
  }

  // Scopes

  public static relatedMember = scope((query: BudgetBuilder, userId: number) => {
    return query.whereHas('members', (budgetBuilder) => {
      budgetBuilder.where('user_id', userId)
    })
  })

  public static budgetMetrics = scope((query: BudgetBuilder, budgetIds: number[]) => {
    return query
      .select(
        'budgets.*',
        Database.raw(
          'IFNULL(ROUND(SUM(time_entries.duration_minutes) / 60, 2), 0) * budgets.hourly_rate AS total_spent'
        ),
        Database.raw(
          'SUM(CASE WHEN budget_tasks.is_billable = true THEN IFNULL(ROUND(time_entries.duration_minutes / 60, 2), 0) * budgets.hourly_rate ELSE 0 END) AS total_billable'
        ),
        Database.raw(
          'SUM(CASE WHEN budget_tasks.is_billable = true THEN IFNULL(time_entries.duration_minutes, 0) ELSE 0 END) AS total_billable_minutes'
        ),
        Database.raw(
          'SUM(CASE WHEN budget_tasks.is_billable = false THEN IFNULL(ROUND(time_entries.duration_minutes / 60, 2), 0) * budgets.hourly_rate ELSE 0 END) AS total_non_billable'
        ),
        Database.raw(
          'SUM(CASE WHEN budget_tasks.is_billable = false THEN IFNULL(time_entries.duration_minutes, 0) ELSE 0 END) AS total_non_billable_minutes'
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
  public static async getBudgetsMetrics(budgetIds: number[], filters?: BudgetFilters) {
    const result = await Budget.query()
      .withScopes((scopes) => scopes.budgetMetrics(budgetIds))
      .preload('project')

      // Filter - Pagination
      .if(filters?.page, (builder) => {
        builder.paginate(filters!.page!, 10)
      })

    return result
  }

  public static async getBudgetMetrics(budgetId: number) {
    const result = await Budget.query()
      .withScopes((scopes) => scopes.budgetMetrics([budgetId]))
      .first()

    return result
  }
}
