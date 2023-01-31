import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Budget from './Budget'
import BillableKind from 'App/Enum/BillableKind'

export default class BillableType extends BaseModel {
  // Fields

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  // Relations - hasMany

  @hasMany(() => Budget, { serializeAs: null })
  public budgets: HasMany<typeof Budget>

  // Static Methods

  public static async getByName(name: BillableKind) {
    return await this.query().where('name', name).first()
  }
}
