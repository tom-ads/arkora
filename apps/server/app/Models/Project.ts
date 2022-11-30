import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeDelete,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Client from './Client'
import Status from 'App/Enum/Status'
import Budget from './Budget'
import User from './User'

export default class Project extends BaseModel {
  // Columns

  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public clientId: number

  @column()
  public name: string

  @column({ serialize: Boolean })
  public showCost: boolean

  @column({ serialize: Boolean })
  public private: boolean

  @column()
  public status: Status

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  // Relationships

  @belongsTo(() => Client)
  public client: BelongsTo<typeof Client>

  @hasMany(() => Budget)
  public budgets: HasMany<typeof Budget>

  @manyToMany(() => User, {
    pivotTable: 'project_members',
  })
  public members: ManyToMany<typeof User>

  // Hooks

  @beforeDelete()
  public static async beforeDelete(project: Project) {
    project.related('budgets').query().delete()
  }
}
