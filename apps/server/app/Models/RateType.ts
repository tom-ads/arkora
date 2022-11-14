import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Rate from 'App/Enum/Rate'

export default class RateType extends BaseModel {
  // Columns

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: Rate

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
