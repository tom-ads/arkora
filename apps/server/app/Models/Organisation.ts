import User from './User'
import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  HasManyThrough,
  hasManyThrough,
  ManyToMany,
  manyToMany,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import Currency from './Currency'
import WorkDay from './WorkDay'
import Client from './Client'
import Project from './Project'

type OrganisationBuilder = ModelQueryBuilderContract<typeof Organisation>

export default class Organisation extends BaseModel {
  // Columns

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ serializeAs: null })
  public currencyId: number

  @column()
  public name: string

  @column()
  public subdomain: string

  @column.dateTime({
    prepare: (time: DateTime) => time.toFormat('HH:mm'),
    serialize: (val: DateTime) => val.toFormat('HH:mm'),
  })
  public openingTime: DateTime

  @column.dateTime({
    prepare: (time: DateTime) => time.toFormat('HH:mm'),
    serialize: (val: DateTime) => val.toFormat('HH:mm'),
  })
  public closingTime: DateTime

  @column()
  public defaultRate: number

  @column.dateTime({ serializeAs: null, autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ serializeAs: null, autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationships

  @hasMany(() => User, { serializeAs: null })
  public users: HasMany<typeof User>

  @belongsTo(() => Currency)
  public currency: BelongsTo<typeof Currency>

  @manyToMany(() => WorkDay, {
    pivotTable: 'organisation_work_days',
    pivotRelatedForeignKey: 'workday_id',
  })
  public workDays: ManyToMany<typeof WorkDay>

  @hasMany(() => Client)
  public clients: HasMany<typeof Client>

  @hasManyThrough([() => Project, () => Client])
  public projects: HasManyThrough<typeof Project>

  // Hooks

  @beforeFind()
  @beforeFetch()
  public static preloadRelations(query: OrganisationBuilder) {
    query.preload('currency').preload('workDays')
  }
}
