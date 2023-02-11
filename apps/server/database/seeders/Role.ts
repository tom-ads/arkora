import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserRole from 'App/Enum/UserRole'
import Role from 'App/Models/Role'

export async function getRoles() {
  return await Role.query()
}

export default class extends BaseSeeder {
  public async run() {
    await Role.updateOrCreateMany(
      'name',
      Object.values(UserRole).map((role) => ({
        name: role,
      }))
    )
  }
}
