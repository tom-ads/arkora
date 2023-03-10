import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Budget from './Budget'
import Organisation from './Organisation'
import { CommonTask } from 'App/Enum/CommonTask'
import { camelCase, startCase } from 'lodash'

export default class Task extends BaseModel {
  // Serialize Pivots

  public serializeExtras() {
    return {
      is_billable: Boolean(this.$extras.pivot_is_billable),
    }
  }

  // Columns

  @column({ isPrimary: true })
  public id: number

  @column({ serialize: (value: string) => startCase(camelCase(value)) })
  public name: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
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
}
