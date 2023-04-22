import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeDelete,
  beforeFetch,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  HasManyThrough,
  hasManyThrough,
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
import { sumBy } from 'lodash'
import TimeEntry from './TimeEntry'

type ProjectInsightsFilter = {
  users: number[]
}

type MemberInsightsFilter = Partial<{
  search: string
}>

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

  @hasManyThrough([() => Budget, () => TimeEntry])
  public timeEntries: HasManyThrough<typeof Budget>

  // Hooks

  @beforeFind()
  @beforeFetch()
  public static preloadRelations(query: ProjectBuilder) {
    query.preload('client')
  }

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

  // Static methods

  public static async isNameTaken(organisation: Organisation, name: string, projectId?: number) {
    const result = await organisation
      .related('projects')
      .query()
      .if(projectId, (query) => query.whereNot('projects.id', projectId!))
      .where('projects.name', name)
      .first()

    return !!result
  }

  // Instance Methods

  public async isAssigned(this: Project, userId: number) {
    const result = await this.related('members').query().where('users.id', userId).first()
    return !!result
  }

  public async getMetricsForMembers(this: Project, filters?: MemberInsightsFilter) {
    const budgetIds = (await this.related('budgets').query()).map((budget) => budget.id)

    const result = await this.related('members')
      .query()
      .whereNotNull('verified_at')
      .withScopes((scope) => scope.userInsights({ budgets: budgetIds }))
      .if(filters?.search, (query) => {
        query
          .whereILike('users.firstname', `%${filters!.search!}%`)
          .orWhereILike('users.lastname', `%${filters!.search!}%`)
      })
      .orderBy('users.lastname')

    return result
  }

  public async assignMembers(this: Project, organisation: Organisation) {
    const members: User[] = await organisation
      .related('users')
      .query()
      .if(this.private, (query) => {
        query.withScopes((scopes) => scopes.organisationAdmins())
      })

    await this.related('members').sync(members.map((member) => member.id))
  }

  public async unassignMember(this: Project, userId: number) {
    // Detach from project
    await this.related('members').detach([userId])

    // Detach from each project budget
    const projectBudgets = await this.related('budgets').query()
    await Promise.all(
      projectBudgets.map(async (budget) => await budget.related('members').detach([userId]))
    )
  }

  public async getInsights(this: Project, filters?: ProjectInsightsFilter) {
    const result = await this.related('budgets')
      .query()
      .withScopes((scopes) => scopes.budgetMetrics())
      .if(filters?.users, (builder) => {
        builder.whereHas('members', (memberBuilder) => {
          memberBuilder.whereIn('time_entries.user_id', filters!.users)
        })
      })
      .exec()

    return {
      allocatedBudget: sumBy(result, (b) => b.allocatedBudget ?? 0),
      allocatedDuration: sumBy(result, (b) => b.allocatedDuration ?? 0),
      billableCost: sumBy(result, (b) => b.billableCost ?? 0),
      billableDuration: sumBy(result, (b) => b.billableDuration ?? 0),
      unbillableCost: sumBy(result, (b) => b.unbillableCost ?? 0),
      unbillableDuration: sumBy(result, (b) => b.unbillableDuration ?? 0),
    }
  }
}
