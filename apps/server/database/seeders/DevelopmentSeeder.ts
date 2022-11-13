import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserRole from 'App/Enum/UserRole'
import Role from 'App/Models/Role'
import { UserFactory } from 'Database/factories'

export default class extends BaseSeeder {
  public static environment = ['development']

  public async createOrganisation() {
    const ownerRole = await Role.findBy('name', UserRole.OWNER)

    await UserFactory.merge({
      roleId: ownerRole?.id,
    })
      .with('organisation', 1, (orgBuilder) => {
        return orgBuilder.with('clients', 1, (clientBuilder) => {
          return clientBuilder.with('projects', 3)
        })
      })
      .create()
  }

  public async run() {
    await this.createOrganisation()
  }
}
