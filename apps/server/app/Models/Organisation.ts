import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Organisation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public subdomain: string

  @hasMany(() => User)
  public users: HasMany<typeof User>

  @column.dateTime({ serializeAs: null, autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ serializeAs: null, autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
