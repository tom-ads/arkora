import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  HasManyThrough,
  hasManyThrough,
} from '@ioc:Adonis/Lucid/Orm'
import Organisation from './Organisation'
import Project from './Project'
import Budget from './Budget'

export default class Client extends BaseModel {
  // Columns

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ serializeAs: null })
  public organisationId: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  // Relations

  @belongsTo(() => Organisation)
  public organisation: BelongsTo<typeof Organisation>

  @hasMany(() => Project)
  public projects: HasMany<typeof Project>

  @hasManyThrough([() => Budget, () => Project])
  public budgets: HasManyThrough<typeof Budget>
}
