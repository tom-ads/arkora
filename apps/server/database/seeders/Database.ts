import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserRole from 'App/Enum/UserRole'
import WeekDay from 'App/Enum/WeekDay'
import Currency from 'App/Models/Currency'
import Role from 'App/Models/Role'
import WorkDay from 'App/Models/WorkDay'
import { currencies } from 'Resources/currencies'

export default class extends BaseSeeder {
  public async createCurrencies() {
    await Currency.createMany(currencies)
  }

  public async createWorkDays() {
    await WorkDay.createMany(
      Object.values(WeekDay).map((weekDay) => ({
        name: weekDay,
      }))
    )
  }

  public async createRoles() {
    await Role.createMany(
      Object.values(UserRole).map((role) => ({
        name: role,
      }))
    )
  }

  public async run() {
    await Promise.all([this.createCurrencies(), this.createWorkDays(), this.createRoles()])
  }
}
