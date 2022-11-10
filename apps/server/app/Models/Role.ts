import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import UserRole from 'App/Enum/UserRole'
import User from './User'

export default class Role extends BaseModel {
  // Columns

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: UserRole

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationships

  @hasMany(() => User)
  public users: HasMany<typeof User>
}
