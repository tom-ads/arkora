import User from './User'
import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Currency from './Currency'
import WorkDay from './WorkDay'

export default class Organisation extends BaseModel {
  // Columns

  @column({ isPrimary: true })
  public id: number

  @column()
  public currencyId: number

  @column()
  public name: string

  @column()
  public subdomain: string

  @column.dateTime()
  public openingTime: DateTime

  @column.dateTime()
  public closingTime: DateTime

  @column()
  public defaultRate: number

  @column.dateTime({ serializeAs: null, autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ serializeAs: null, autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationships

  @hasMany(() => User)
  public users: HasMany<typeof User>

  @belongsTo(() => Currency)
  public currency: BelongsTo<typeof Currency>

  @manyToMany(() => WorkDay, {
    pivotTable: 'organisation_workdays',
    pivotRelatedForeignKey: 'workday_id',
  })
  public workDays: ManyToMany<typeof WorkDay>
}
