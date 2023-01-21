import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import Project from './Project'
import BudgetType from './BudgetType'
import User from './User'
import Task from './Task'
import TimeEntry from './TimeEntry'

type BudgetBuilder = ModelQueryBuilderContract<typeof Budget>

export default class Budget extends BaseModel {
  // Columns

  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public budgetTypeId: number

  @column({ serializeAs: null })
  public projectId: number

  @column()
  public name: string

  @column()
  public hourlyRate: number

  @column()
  public budget: number

  @column({ serialize: Boolean })
  public billable: boolean

  @column({ serialize: Boolean })
  public private: boolean

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  // Relations

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @belongsTo(() => BudgetType, { serializeAs: 'budget_type' })
  public budgetType: BelongsTo<typeof BudgetType>

  @manyToMany(() => User, {
    pivotTable: 'budget_members',
  })
  public members: ManyToMany<typeof User>

  @manyToMany(() => Task, {
    pivotTable: 'budget_tasks',
    pivotColumns: ['is_billable'],
  })
  public tasks: ManyToMany<typeof Task>

  @hasMany(() => TimeEntry)
  public timeEntries: HasMany<typeof TimeEntry>

  // Hooks

  @beforeFind()
  @beforeFetch()
  public static preloadRelations(query: BudgetBuilder) {
    query.preload('budgetType')
  }

  // Scopes
  public static async getBudgetsWithProjectFields(budgetIds: number[], projectFields: string) {
    return await Budget.query()
      .select('budgets.*', projectFields)
      .join('projects', 'budgets.project_id', '=', 'projects.id')
      .whereIn('budgets.id', budgetIds)
      .preload('project')
      .exec()
  }
}
