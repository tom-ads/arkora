import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  ManyToMany,
  manyToMany,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import Organisation from './Organisation'

type WorkDayBuilder = ModelQueryBuilderContract<typeof WorkDay>

export default class WorkDay extends BaseModel {
  // Columns

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  // Relationships

  @manyToMany(() => Organisation, {
    pivotTable: 'organisation_work_days',
    pivotForeignKey: 'workday_id',
  })
  public organisations: ManyToMany<typeof Organisation>

  // Scopes

  public static workDayNames = scope((query: WorkDayBuilder, days: string[]) => {
    query.whereIn('name', days)
  })
}
