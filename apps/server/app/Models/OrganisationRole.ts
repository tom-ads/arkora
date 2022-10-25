import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Role from 'App/Enum/Role'
import User from './User'

export default class OrganisationRole extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: Role

  @hasMany(() => User)
  public users: HasMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
