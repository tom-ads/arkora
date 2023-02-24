import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeDelete,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import Client from './Client'
import Status from 'App/Enum/Status'
import Budget from './Budget'
import User from './User'
import Organisation from './Organisation'

type ProjectBuilder = ModelQueryBuilderContract<typeof Project>

export default class Project extends BaseModel {
  // Columns

  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public clientId: number

  @column()
  public name: string

  @column({ serialize: Boolean })
  public showCost: boolean

  @column({ serialize: Boolean })
  public private: boolean

  @column()
  public status: Status

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  // Relationships

  @belongsTo(() => Client)
  public client: BelongsTo<typeof Client>

  @hasMany(() => Budget)
  public budgets: HasMany<typeof Budget>

  @manyToMany(() => User, {
    pivotTable: 'project_members',
  })
  public members: ManyToMany<typeof User>

  // Hooks

  @beforeDelete()
  public static async beforeDelete(project: Project) {
    await project.related('budgets').query().delete()
    await project.related('members').query().delete()
  }

  // Scopes

  public static relatedMember = scope((query: ProjectBuilder, userId: number) => {
    return query.whereHas('members', (projectBuilder) => {
      projectBuilder.where('user_id', userId)
    })
  })

  public static privateProject = scope((query: ProjectBuilder) => {
    return query.where('private', true)
  })

  public static publicProject = scope((query: ProjectBuilder) => {
    return query.where('private', false)
  })

  // Methods

  public async assignProjectMembers(
    organisation: Organisation,
    project: Project,
    members: number[]
  ) {
    await project.related('members').detach()

    const projectMembers: User[] = await organisation
      .related('users')
      .query()
      .if(project.private, (query) => {
        query.withScopes((scopes) => scopes.organisationAdmins())
      })
      .exec()

    await project.related('members').attach(projectMembers.map((member) => member.id))
  }
}
