import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany, scope } from '@ioc:Adonis/Lucid/Orm'
import Organisation from './Organisation'

export default class WorkDay extends BaseModel {
  // Columns

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationships

  @manyToMany(() => Organisation, {
    pivotTable: 'organisation_work_days',
    pivotForeignKey: 'workday_id',
  })
  public organisations: ManyToMany<typeof Organisation>

  // Scopes

  public static workDayNames = scope((query, days: string[]) => {
    query.whereIn('name', days)
  })
}
