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
  ManyToMany,
  manyToMany,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import Currency from './Currency'
import WorkDay from './WorkDay'

type OrganisationQueryBuilder = ModelQueryBuilderContract<typeof Organisation>

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

  @column.dateTime({ serialize: (val: DateTime) => val.toFormat('HH:mm') })
  public openingTime: DateTime

  @column.dateTime({ serialize: (val: DateTime) => val.toFormat('HH:mm') })
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

  // Hooks

  @beforeFind()
  @beforeFetch()
  public static preloadRelations(query: OrganisationQueryBuilder) {
    query.preload('currency').preload('workDays')
  }
}
