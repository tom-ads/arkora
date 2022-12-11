import Budget from 'App/Models/Budget'
import Factory from '@ioc:Adonis/Lucid/Factory'
import BudgetType from 'App/Models/BudgetType'
import TaskFactory from './TaskFactory'

export default Factory.define(Budget, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    hourlyRate: 10000,
    budget: 1000000,
    billable: true,
    private: true,
  }
})
  .relation('tasks', () => TaskFactory)
  .relation('budgetType', () => BudgetType)
  .build()
