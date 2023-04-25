import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Budget from './Budget'
import Organisation from './Organisation'
import Database from '@ioc:Adonis/Lucid/Database'

export default class Task extends BaseModel {
  // Serialize Pivots

  public serializeExtras() {
    return {
      billable_duration: parseInt(this.$extras.billable_duration ?? 0, 10),
      unbillable_duration: parseInt(this.$extras.unbillable_duration ?? 0, 10),
    }
  }

  // Columns

  @column({ isPrimary: true })
  public id: number

  @column()
  public budgetId: number

  @column()
  public name: string

  @column({ serialize: Boolean })
  public isBillable: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  // Relationships

  @belongsTo(() => Organisation)
  public organisation: BelongsTo<typeof Organisation>

  @belongsTo(() => Budget)
  public budget: BelongsTo<typeof Budget>

  // Static Methods

  public static async getBudgetTasks(budgetId: number) {
    const result = await Task.query()
      .select(
        'tasks.*',
        Database.raw(
          'SUM(CASE WHEN tasks.is_billable = true THEN IFNULL(time_entries.duration_minutes, 0) ELSE 0 END) AS billable_duration'
        ),
        Database.raw(
          'SUM(CASE WHEN tasks.is_billable = false THEN IFNULL(time_entries.duration_minutes, 0) ELSE 0 END) AS unbillable_duration'
        )
      )
      .leftJoin('time_entries', (query) => {
        query
          .on('tasks.budget_id', '=', 'time_entries.budget_id')
          .andOn('tasks.id', '=', 'time_entries.task_id')
      })
      .where('tasks.budget_id', budgetId)
      .groupBy('tasks.id')
      .orderBy('tasks.name')

    return result
  }
}
