import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  ModelQueryBuilderContract,
  beforeFetch,
  beforeFind,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Budget from './Budget'

type NoteBuilder = ModelQueryBuilderContract<typeof BudgetNote>

export default class BudgetNote extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public budgetId: number

  @column()
  public userId: number

  @column()
  public note: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  // Relationships

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Budget)
  public budget: BelongsTo<typeof Budget>

  // Hooks

  @beforeFind()
  @beforeFetch()
  public static preloadRelations(query: NoteBuilder) {
    query.preload('user')
  }
}
