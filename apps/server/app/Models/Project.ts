import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Client from './Client'
import Status from 'App/Enum/Status'

export default class Project extends BaseModel {
  // Columns

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ serializeAs: null })
  public clientId: number

  @column()
  public name: string

  @column({ consume: (value) => Boolean(value) })
  public showCost: boolean

  @column({ consume: (value) => Boolean(value) })
  public private: boolean

  @column()
  public status: Status

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  // Relations

  @belongsTo(() => Client)
  public client: BelongsTo<typeof Client>
}
