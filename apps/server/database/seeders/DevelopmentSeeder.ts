import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import BillableKind from 'App/Enum/BillableKind'
import UserRole from 'App/Enum/UserRole'
import Role from 'App/Models/Role'
import { OrganisationFactory, UserFactory } from 'Database/factories'
import { getBillableTypes } from './BillableType'
import { getBudgetTypes } from './BudgetType'
import { getCommonTasks } from './Task'

export default class extends BaseSeeder {
  public static environment = ['development']

  public async createUser(fields?: object, role?: UserRole) {
    const dbRole = await Role.findBy('name', role ?? UserRole.OWNER)

    return await UserFactory.merge({
      ...fields,
      roleId: dbRole?.id,
    }).create()
  }

  public async createOrganisation() {
    const budgetTypes = await getBudgetTypes()
    const billableTypes = await getBillableTypes()

    const totalCost = billableTypes.find((type) => type.name === BillableKind.TOTAL_COST)!

    return await OrganisationFactory.with('clients', 1, (clientBuilder) => {
      clientBuilder.with('projects', 5, (projectBuilder) => {
        projectBuilder
          .with('members', 5, (memberBuilder) => {
            memberBuilder.merge({ organisationId: 1, roleId: 4, password: 'newPassword123!' })
          })
          .with('budgets', 5, (budgetBuilder) => {
            return budgetBuilder.merge({
              budgetTypeId: budgetTypes?.[0].id,
              billableTypeId: totalCost.id,
            })
          })
      })
    }).create()
  }

  public async run() {
    const [organisation, testUser, commonTasks] = await Promise.all([
      this.createOrganisation(),
      this.createUser({
        email: 'ta@example.com',
        password: 'newPassword123!',
      }),
      getCommonTasks(),
    ])

    // Load projects and budgets
    await organisation.load('projects')
    await Promise.all(organisation.projects.map(async (project) => await project.load('budgets')))

    const projects = organisation.projects
    const budgets = projects.map((project) => project.budgets).flat()

    // Link common tasks to each organisation and budget
    await Promise.all([
      organisation.related('tasks').attach(commonTasks.map((task) => task.id)),
      ...budgets.map(
        async (budget) => await budget.related('tasks').attach(commonTasks.map((task) => task.id))
      ),
    ])

    // Link testUser to organisation and relations
    await Promise.all([
      testUser.related('organisation').associate(organisation),
      ...projects.map(async (project) => await project.related('members').attach([testUser.id])),
      ...budgets.map(async (budget) => await budget.related('members').attach([testUser.id])),
    ])
  }
}
