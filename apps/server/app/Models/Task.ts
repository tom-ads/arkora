import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Budget from './Budget'
import Organisation from './Organisation'
import { CommonTask } from 'App/Enum/CommonTask'
import { camelCase, startCase } from 'lodash'
import Database from '@ioc:Adonis/Lucid/Database'

export default class Task extends BaseModel {
  // Serialize Pivots

  public serializeExtras() {
    return {
      is_billable: Boolean(this.$extras.pivot_is_billable),
      billable_duration: parseInt(this.$extras.billable_duration ?? 0, 10),
      unbillable_duration: parseInt(this.$extras.unbillable_duration ?? 0, 10),
    }
  }

  // Columns

  @column({ isPrimary: true })
  public id: number

  @column({ serialize: (value: string) => startCase(camelCase(value)) })
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  // Relationships

  @manyToMany(() => Organisation, {
    pivotTable: 'common_tasks',
    pivotColumns: ['is_billable'],
  })
  public organisations: ManyToMany<typeof Organisation>

  @manyToMany(() => Budget, {
    pivotTable: 'budget_tasks',
    pivotColumns: ['is_billable'],
  })
  public budgets: ManyToMany<typeof Budget>

  // Static Methods

  public static async getDefaultTasks() {
    return await Task.query().whereIn('name', Object.values(CommonTask))
  }

  public static async getOrganisationTasks(organisationId: number) {
    const result = await Task.query()
      .whereHas('organisations', (query) => {
        query.where('id', organisationId)
      })
      .exec()

    return result
  }

  public static async getBudgetTasks(budgetId: number) {
    const result = await Task.query()
      .select(
        'tasks.*',
        'budget_tasks.is_billable',
        Database.raw(
          'SUM(CASE WHEN budget_tasks.is_billable = true THEN IFNULL(time_entries.duration_minutes, 0) ELSE 0 END) AS billable_duration'
        ),
        Database.raw(
          'SUM(CASE WHEN budget_tasks.is_billable = false THEN IFNULL(time_entries.duration_minutes, 0) ELSE 0 END) AS unbillable_duration'
        )
      )
      .innerJoin('budget_tasks', 'tasks.id', '=', 'budget_tasks.task_id')
      .leftJoin('time_entries', (query) => {
        query
          .on('budget_tasks.budget_id', '=', 'time_entries.budget_id')
          .andOn('budget_tasks.task_id', '=', 'time_entries.task_id')
      })
      .where('budget_tasks.budget_id', budgetId)
      .groupBy('tasks.id')

    return result
  }
}
