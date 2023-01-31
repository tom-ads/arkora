import Budget from 'App/Models/Budget'
import Factory from '@ioc:Adonis/Lucid/Factory'
import TaskFactory from './TaskFactory'
import UserFactory from './UserFactory'
import BudgetTypeFactory from './BudgetTypeFactory'
import BillableTypeFactory from './BillableTypeFactory'

export default Factory.define(Budget, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    colour: faker.color.rgb(),
    hourlyRate: 10000,
    budget: 1000000,
    private: true,
  }
})
  .relation('tasks', () => TaskFactory)
  .relation('budgetType', () => BudgetTypeFactory)
  .relation('members', () => UserFactory)
  .relation('billableType', () => BillableTypeFactory)
  .build()
