import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, beforeSave, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class PasswordReset extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public token: string

  @column.dateTime()
  public usedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationships

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  // Hooks

  @beforeSave()
  public static async hashToken(passwordReset: PasswordReset) {
    if (passwordReset.$dirty.token) {
      passwordReset.token = await Hash.make(passwordReset.token)
    }
  }

  // Static Methods

  public static async getUserToken(userId: number) {
    const result = await PasswordReset.query()
      .where('user_id', userId)
      .whereNull('used_at')
      .where(
        'created_at',
        '>',
        DateTime.now().minus({ minutes: 60 }).toSQL({ includeOffset: false })!
      )
      .first()

    return result
  }

  public static async invalidateUserTokens(userId: number) {
    await PasswordReset.query()
      .where('user_id', userId)
      .whereNull('used_at')
      .update({ usedAt: DateTime.now().toSQL({ includeOffset: false }) })
  }
}
