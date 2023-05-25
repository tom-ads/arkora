import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  belongsTo,
  BelongsTo,
  scope,
  ModelQueryBuilderContract,
  beforeFind,
  beforeFetch,
  manyToMany,
  ManyToMany,
  computed,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Role from 'App/Models/Role'
import Organisation from './Organisation'
import Project from './Project'
import Budget from './Budget'
import UserRole from 'App/Enum/UserRole'
import TimeEntry from './TimeEntry'
import Database from '@ioc:Adonis/Lucid/Database'
import PasswordReset from './PasswordReset'

type InsightFilters = Partial<{
  users: number[]
  projects: number[]
  budgets: number[]
}>

type UserBuilder = ModelQueryBuilderContract<typeof User>

export default class User extends BaseModel {
  // Columns

  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public roleId: number

  @column({ serializeAs: null })
  public organisationId: number

  @column()
  public firstname: string

  @column()
  public lastname: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public verificationCode: string | null

  @column.dateTime()
  public verifiedAt: DateTime | null

  @column({ serializeAs: null })
  public rememberMeToken: string | null

  @column.dateTime()
  public lastActiveAt: DateTime

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  // Computed

  @computed()
  public get initials(): string {
    const fnInitial = this.firstname ? this.firstname.charAt(0) : ''
    const lsInitial = this.lastname ? this.lastname.charAt(0) : ''

    return `${fnInitial}${lsInitial}`
  }

  @computed({ serializeAs: 'spent_duration' })
  public get spentDuration() {
    return this.billableDuration + this.unbillableDuration
  }

  @computed({ serializeAs: 'billable_duration' })
  public get billableDuration() {
    return parseInt(this.$extras.billable_duration ?? 0, 10)
  }

  @computed({ serializeAs: 'unbillable_duration' })
  public get unbillableDuration() {
    return parseInt(this.$extras.unbillable_duration ?? 0, 10)
  }

  // Relationships

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @belongsTo(() => Organisation)
  public organisation: BelongsTo<typeof Organisation>

  @manyToMany(() => Project, {
    pivotTable: 'project_members',
  })
  public projects: ManyToMany<typeof Project>

  @manyToMany(() => Budget, {
    pivotTable: 'budget_members',
  })
  public budgets: ManyToMany<typeof Budget>

  @hasMany(() => TimeEntry)
  public timeEntries: HasMany<typeof TimeEntry>

  @hasMany(() => PasswordReset)
  public passwordResets: HasMany<typeof PasswordReset>

  // Hooks

  @beforeFind()
  @beforeFetch()
  public static preloadRelations(query: UserBuilder) {
    query.preload('role')
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeSave()
  public static async hashVerificationCode(user: User) {
    if (user.$dirty.verificationCode) {
      user.verificationCode = await Hash.make(user.verificationCode!)
    }
  }

  // Scopes

  public static organisationUser = scope((query: UserBuilder, email: string, subdomain: string) => {
    return query
      .where('email', email)
      .whereHas('organisation', (query) => query.where('subdomain', subdomain))
  })

  public static organisationAdmins = scope((query: UserBuilder) => {
    return query.whereHas('role', (query) =>
      query.whereIn('name', [UserRole.OWNER, UserRole.ORG_ADMIN, UserRole.MANAGER])
    )
  })

  public static userInsights = scope((query: UserBuilder, filters?: InsightFilters) => {
    query
      .select(
        'users.*',
        Database.raw(
          'SUM(CASE WHEN tasks.is_billable = true THEN IFNULL(time_entries.duration_minutes, 0) ELSE 0 END) AS billable_duration'
        ),
        Database.raw(
          'SUM(CASE WHEN tasks.is_billable = false THEN IFNULL(time_entries.duration_minutes, 0) ELSE 0 END) AS unbillable_duration'
        )
      )
      .leftJoin('time_entries', (query) => {
        query.on('users.id', '=', 'time_entries.user_id')
        if (filters?.budgets?.length) {
          query.andOnIn('time_entries.budget_id', filters?.budgets)
        }
      })
      .leftJoin('tasks', (query) => {
        query
          .on('time_entries.budget_id', '=', 'tasks.budget_id')
          .andOn('time_entries.task_id', '=', 'tasks.id')
      })
      .groupBy('users.id')
  })

  // Static Methods

  public static async getProjectInsights(organisationId: number, projectId: number) {
    const project = await Project.query().where('id', projectId).preload('budgets').first()
    const budgetIds = project?.budgets.map((budget) => budget.id)

    const result = await User.query()
      .where('users.organisation_id', organisationId)
      .whereIn(
        'users.id',
        Database.query()
          .from('project_members')
          .where('project_members.project_id', projectId)
          .distinct('project_members.user_id')
      )
      .withScopes((scopes) => scopes.userInsights({ budgets: budgetIds }))
      .orderBy('users.lastname')

    return result
  }

  // Instance Methods

  // TODO: After create, assign user to organisation budgets that are not private

  public async getActiveTimer(this: User) {
    return await this.related('timeEntries')
      .query()
      .whereNull('last_stopped_at')
      .preload('budget', (query) => query.preload('project'))
      .preload('task')
      .first()
  }
}
