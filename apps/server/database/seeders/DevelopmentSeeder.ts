import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserRole from 'App/Enum/UserRole'
import BudgetType from 'App/Models/BudgetType'
import Role from 'App/Models/Role'
import { UserFactory } from 'Database/factories'

export default class extends BaseSeeder {
  public static environment = ['development']

  public async createOrganisation() {
    const ownerRole = await Role.findBy('name', UserRole.OWNER)
    const budgetTypes = await BudgetType.query()

    await UserFactory.merge({
      roleId: ownerRole?.id,
      email: 'ta@example.com',
      password: 'newPassword123!',
    })
      .with('organisation', 1, (orgBuilder) => {
        return orgBuilder
          .merge({ name: 'Test Organisation', subdomain: 'test-org' })
          .with('clients', 1, (clientBuilder) => {
            return clientBuilder.with('projects', 3, (projectBuilder) => {
              return projectBuilder
                .with('members', 5, (memberBuilder) => {
                  return memberBuilder.merge({ organisationId: 1, roleId: 4 })
                })
                .with('budgets', 5, (budgetBuilder) => {
                  return budgetBuilder.merge({ budgetTypeId: budgetTypes?.[0].id })
                })
            })
          })
      })
      .create()
  }

  public async run() {
    await this.createOrganisation()
  }
}
