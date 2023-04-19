import User from './User'
import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  computed,
  HasMany,
  hasMany,
  HasManyThrough,
  hasManyThrough,
  ManyToMany,
  manyToMany,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import Currency from './Currency'
import WorkDay from './WorkDay'
import Client from './Client'
import Project from './Project'
import UserRole from 'App/Enum/UserRole'
import Verify from 'App/Enum/Verify'
import { string } from '@ioc:Adonis/Core/Helpers'
import Role from './Role'
import OrganisationInvitation from 'App/Mailers/OrganisationInvitation'
import CommonTask from './CommonTask'

type Invitee = {
  email: string
  role: UserRole
}

type BudgetFilters = Partial<{
  userId: number
  projectId: number
}>

type TeamFilters = Partial<{
  search: string
  role: UserRole
  status: Verify
  projectId: number
  page: number
}>

type BudgetOptions = Partial<{
  includeProject: boolean
}>

type OrganisationBuilder = ModelQueryBuilderContract<typeof Organisation>

export default class Organisation extends BaseModel {
  // Columns

  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public currencyId: number

  @column()
  public name: string

  @column()
  public subdomain: string

  @column.dateTime({
    prepare: (time: DateTime) => time.toFormat('HH:mm'),
    serialize: (val: DateTime) => val.toFormat('HH:mm'),
  })
  public openingTime: DateTime

  @column.dateTime({
    prepare: (time: DateTime) => time.toFormat('HH:mm'),
    serialize: (val: DateTime) => val.toFormat('HH:mm'),
  })
  public closingTime: DateTime

  @column()
  public breakDuration: number

  @column()
  public defaultRate: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ serializeAs: null, autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Computed

  @computed({ serializeAs: 'business_days' })
  public get businessDays() {
    return this.workDays?.map((day) => day.name) ?? []
  }

  // Relationships

  @hasMany(() => User, { serializeAs: null })
  public users: HasMany<typeof User>

  @hasMany(() => CommonTask, { serializeAs: 'common_tasks' })
  public commonTasks: HasMany<typeof CommonTask>

  @hasMany(() => Client)
  public clients: HasMany<typeof Client>

  @belongsTo(() => Currency)
  public currency: BelongsTo<typeof Currency>

  @manyToMany(() => WorkDay, {
    pivotTable: 'organisation_work_days',
    pivotRelatedForeignKey: 'workday_id',
    serializeAs: null,
  })
  public workDays: ManyToMany<typeof WorkDay>

  @hasManyThrough([() => Project, () => Client])
  public projects: HasManyThrough<typeof Project>

  // Hooks

  @beforeFind()
  @beforeFetch()
  public static preloadRelations(query: OrganisationBuilder) {
    query.preload('currency').preload('workDays').preload('commonTasks')
  }

  // Instance Methods

  public async getPrivilegedUsers(this: Organisation) {
    return await this.related('users')
      .query()
      .whereHas('role', (roleQuery) => {
        roleQuery.whereIn('name', [UserRole.OWNER, UserRole.ORG_ADMIN, UserRole.MANAGER])
      })
      .exec()
  }

  public async getBudgets(this: Organisation, filters?: BudgetFilters, options?: BudgetOptions) {
    const projects = await this.related('projects')
      .query()
      .if(filters?.projectId, (projectBuilder) => {
        projectBuilder.where('projects.id', filters!.projectId!)
      })
      // Ensure related projects have a member with specified user_id
      .if(filters?.userId, (projectBuilder) => {
        projectBuilder.withScopes((scope) => scope.relatedMember(filters?.userId!))
      })
      .preload('budgets', (budgetQuery) => {
        budgetQuery
          .withScopes((scope) => scope.budgetMetrics())
          // Ensure related budgets have a member with specified user_id
          .if(filters?.userId, (budgetBuilder) => {
            budgetBuilder.withScopes((scope) => scope.relatedMember(filters?.userId!))
          })
          // Optionally include project to budget when retrieving
          .if(options?.includeProject, (budgetBuilder) => {
            budgetBuilder.preload('project')
          })
      })
      .orderBy('name', 'asc')
      .exec()

    return projects?.map((project) => project?.budgets).flat()
  }

  public async isRelatedBudget(this: Organisation, budgetId: number) {
    const result = await this.related('projects')
      .query()
      .whereHas('budgets', (budgetBuilder) => {
        budgetBuilder.where('id', budgetId)
      })
      .first()

    return !!result
  }

  public async getTeamMembers(this: Organisation, filters?: TeamFilters) {
    const result = await this.related('users')
      .query()
      .select('users.*')
      .if(filters?.search, (builder) => {
        builder
          .whereILike('users.firstname', `%${filters!.search!}%`)
          .orWhereILike('users.lastname', `%${filters!.search!}%`)
      })
      .if(filters?.projectId, (builder) => {
        builder.whereHas('projects', (projectBuilder) => {
          projectBuilder.where('id', filters?.projectId!)
        })
      })
      .if(filters?.role, (userBuilder) =>
        userBuilder.whereHas('role', (roleBuilder) => {
          roleBuilder.where('name', filters?.role!)
        })
      )
      .if(filters?.page, (userBuilder) => {
        userBuilder.forPage(filters!.page!, 10)
      })
      .match(
        [
          filters?.status === Verify.INVITE_ACCEPTED,
          (userBuilder) => userBuilder.whereNotNull('verified_at'),
        ],
        [
          filters?.status === Verify.INVITE_PENDING,
          (userBuilder) => userBuilder.whereNull('verified_at'),
        ]
      )
      .orderBy('users.lastname')

    return result
  }

  public async inviteMembers(this: Organisation, invitees: Invitee[]) {
    const roles = await Role.all()

    const createdMembers = await Promise.all(
      invitees.map(async (invitee) => {
        const invitationCode = string.generateRandom(32)
        const createdUser = await this.related('users').create({
          roleId: roles.find((role) => role.name === invitee.role)!.id,
          email: invitee.email,
          verificationCode: invitationCode,
        })

        await new OrganisationInvitation(this, createdUser, invitationCode).send()

        return createdUser
      })
    )

    return createdMembers
  }

  public async associateMembers(this: Organisation, members: User[]) {
    const memberIds = members.map((member) => member.id)

    const publicProjects = await this.related('projects')
      .query()
      .withScopes((scope) => scope.publicProject())
      .preload('budgets', (budgetQuery) => {
        budgetQuery.withScopes((scope) => scope.publicBudget())
      })

    const publicBudgets = publicProjects.map((project) => project.budgets).flat()

    await Promise.all([
      ...publicProjects.map(async (project) => await project.related('members').attach(memberIds)),
      ...publicBudgets.map(async (budget) => await budget.related('members').attach(memberIds)),
    ])
  }
}
