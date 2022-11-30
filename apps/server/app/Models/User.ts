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
} from '@ioc:Adonis/Lucid/Orm'
import Role from 'App/Models/Role'
import Organisation from './Organisation'
import Project from './Project'
import Budget from './Budget'
import UserRole from 'App/Enum/UserRole'

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
  public rememberMeToken: string | null

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
}
