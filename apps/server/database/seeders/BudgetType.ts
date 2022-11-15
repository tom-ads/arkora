import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Budget from 'App/Enum/BudgetKind'
import BudgetType from 'App/Models/BudgetType'

export default class extends BaseSeeder {
  public async run() {
    await BudgetType.updateOrCreateMany(
      'name',
      Object.values(Budget).map((budgetType) => ({
        name: budgetType,
      }))
    )
  }
}
