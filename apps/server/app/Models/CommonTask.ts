import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Organisation from './Organisation'
import { camelCase, startCase } from 'lodash'
import { DefaultTask } from 'App/Enum/DefaultTask'

export default class CommonTask extends BaseModel {
  // Columns

  @column({ isPrimary: true })
  public id: number

  @column()
  public organisationId: number

  @column({ serialize: (value: string) => startCase(camelCase(value)) })
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

  // Static Methods

  public static async createDefaultTasks(organisationId: number) {
    const result = await CommonTask.createMany(
      Object.values(DefaultTask).map((task) => ({ organisationId, name: task }))
    )

    return result
  }

  public static async getOrganisationTasks(organisationId: number) {
    const result = await CommonTask.query()
      .whereHas('organisation', (query) => {
        query.where('id', organisationId)
      })
      .exec()

    return result
  }
}
