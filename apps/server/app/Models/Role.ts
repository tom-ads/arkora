import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import UserRole from 'App/Enum/UserRole'
import User from './User'
import { camelCase, startCase } from 'lodash'

export default class Role extends BaseModel {
  // Columns

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ serialize: (value: UserRole) => startCase(camelCase(value)) })
  public name: UserRole

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  // Relationships

  @hasMany(() => User, { serializeAs: null })
  public users: HasMany<typeof User>
}
