import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Budget from './Budget'
import BudgetKind from 'App/Enum/BudgetKind'

export default class BudgetType extends BaseModel {
  // Columns

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public name: BudgetKind

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  // Relation

  @hasMany(() => Budget)
  public budgets: HasMany<typeof Budget>
}
