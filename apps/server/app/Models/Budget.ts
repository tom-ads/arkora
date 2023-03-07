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
  projectId: number
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

  @computed({ serializeAs: 'allocated_budget' })
  public get allocatedBudget() {
    // Non-billable budgets, do not have cost involved.
    if (this.budgetType.name === BudgetKind.NON_BILLABLE) {
      return
    }

    // Budget cost is the fixed price
    if (this.budgetType.name === BudgetKind.FIXED) {
      return this.fixedPrice
    }

    // Hour based budgets need to calc total cost using: total_hours * rate
    if (
      this?.budgetType?.name === BudgetKind.VARIABLE &&
      this?.billableType?.name === BillableKind.TOTAL_HOURS
    ) {
      return (this.budget / 60) * ((this.hourlyRate ?? 0) / 100)
    }

    return this.budget
  }

  @computed({ serializeAs: 'allocated_duration' })
  public get allocatedDuration() {
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

  @computed({ serializeAs: 'spent_cost' })
  public get spentCost() {
    if (this.budgetType?.name === BudgetKind.NON_BILLABLE) {
      return
    }

    return (this.billableCost ?? 0) + (this.unbillableCost ?? 0)
  }

  @computed({ serializeAs: 'remaining_cost' })
  public get remainingCost() {
    if (this.budgetType?.name === BudgetKind.NON_BILLABLE) {
      return
    }

    if (
      this.budgetType?.name === BudgetKind.VARIABLE &&
      this.billableType?.name === BillableKind.TOTAL_HOURS
    ) {
      return this.allocatedBudget! - this.spentCost!
    }

    return (this.fixedPrice ? this.fixedPrice : this.budget) - this.spentCost!
  }

  @computed({ serializeAs: 'billable_cost' })
  public get billableCost() {
    if (this.budgetType?.name === BudgetKind.NON_BILLABLE) {
      return
    }

    if (
      this.budgetType?.name === BudgetKind.FIXED &&
      this.billableType?.name === BillableKind.TOTAL_HOURS
    ) {
      const approxRate = this.fixedPrice! / Math.round(this.budget / 60)
      const durationHrs = Math.round((this.billableDuration ?? 0) / 60)
      return durationHrs * approxRate
    }

    return parseInt(this.$extras.billable_cost ?? 0, 10)
  }

  @computed({ serializeAs: 'billable_duration' })
  public get billableDuration() {
    if (this.budgetType?.name === BudgetKind.NON_BILLABLE) {
      return
    }

    return parseInt(this.$extras.billable_duration ?? 0, 10)
  }

  @computed({ serializeAs: 'unbillable_cost' })
  public get unbillableCost() {
    if (this.budgetType?.name === BudgetKind.NON_BILLABLE) {
      return
    }

    if (
      this.budgetType?.name === BudgetKind.FIXED &&
      this.billableType?.name === BillableKind.TOTAL_HOURS
    ) {
      /* 
        Improv: Use a more rigorous rounding method instead of math.round,
        10.08333333 -> 10 ...
      */
      const approxRate = this.fixedPrice! / Math.round(this.budget / 60)
      const durationHrs = Math.round((this.unbillableDuration ?? 0) / 60)
      return durationHrs * approxRate
    }

    return parseInt(this.$extras.unbillable_cost ?? 0, 10)
  }

  @computed({ serializeAs: 'unbillable_duration' })
  public get unbillableDuration() {
    if (this.budgetType?.name === BudgetKind.NON_BILLABLE) {
      return
    }
    return parseInt(this.$extras.unbillable_duration ?? 0, 10)
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

  public static privateBudget = scope((query: BudgetBuilder) => {
    return query.where('private', true)
  })

  public static publicBudget = scope((query: BudgetBuilder) => {
    return query.where('private', false)
  })

  public static budgetMetrics = scope((query: BudgetBuilder) => {
    return query
      .select(
        'budgets.*',
        'entries.billable_duration',
        'entries.unbillable_duration',
        Database.raw(
          'ROUND(ROUND(IFNULL(entries.billable_duration / 60, 0), 2) * budgets.hourly_rate) AS billable_cost'
        ),
        Database.raw(
          'ROUND(ROUND(IFNULL(entries.unbillable_duration / 60, 0), 2) * budgets.hourly_rate) AS unbillable_cost'
        )
      )
      .joinRaw(
        `
          LEFT JOIN (
            SELECT
              budget_tasks.budget_id,
              SUM(CASE WHEN budget_tasks.is_billable = true THEN IFNULL(time_entries.duration_minutes, 0) ELSE 0 END) AS billable_duration,
              SUM(CASE WHEN budget_tasks.is_billable = false THEN IFNULL(time_entries.duration_minutes, 0) ELSE 0 END) AS unbillable_duration
            FROM budget_tasks
            LEFT JOIN time_entries
            ON budget_tasks.budget_id = time_entries.budget_id
            AND budget_tasks.task_id = time_entries.task_id
            GROUP BY budget_tasks.budget_id
          ) AS entries
          ON budgets.id = entries.budget_id
        `
      )
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
      .withScopes((scopes) => scopes.budgetMetrics())
      .whereIn('budgets.id', budgetIds)
      .preload('project')

      .if(filters?.projectId, (builder) => {
        builder.where('budgets.project_id', filters!.projectId!)
      })

      .if(filters?.page, (builder) => {
        builder.forPage(filters!.page!, 10)
      })

    return result
  }

  public static async getBudgetMetrics(budgetId: number) {
    const result = await Budget.query()
      .withScopes((scopes) => scopes.budgetMetrics())
      .where('budgets.id', budgetId)
      .first()

    return result
  }
}
