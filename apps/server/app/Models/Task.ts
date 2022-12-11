import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Budget from './Budget'
import Organisation from './Organisation'
import { CommonTask } from 'App/Enum/CommonTask'

export default class Task extends BaseModel {
  // Columns

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  // Relationships

  @manyToMany(() => Organisation, {
    pivotTable: 'common_tasks',
  })
  public organisations: ManyToMany<typeof Organisation>

  @manyToMany(() => Budget, {
    pivotTable: 'budget_tasks',
  })
  public budgets: ManyToMany<typeof Budget>

  // Methods

  public static async getCommonTasks() {
    return await Task.query().whereIn('name', Object.values(CommonTask))
  }
}
