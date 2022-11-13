import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Organisation from './Organisation'

export default class Currency extends BaseModel {
  public static table = 'currencies'

  // Columns

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public code: string

  @column()
  public name: string

  @column()
  public symbol: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  // Relationships

  @hasMany(() => Organisation)
  public organisations: HasMany<typeof Organisation>
}
