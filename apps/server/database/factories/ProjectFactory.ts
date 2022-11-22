import Factory from '@ioc:Adonis/Lucid/Factory'
import Status from 'App/Enum/Status'
import Project from 'App/Models/Project'
import BudgetFactory from './BudgetFactory'
import ClientFactory from './ClientFactory'
import UserFactory from './UserFactory'

export default Factory.define(Project, ({ faker }) => {
  return {
    name: faker.company.name(),
    showCost: false,
    private: false,
    status: Status.ACTIVE,
  }
})
  .relation('members', () => UserFactory)
  .relation('budgets', () => BudgetFactory)
  .relation('client', () => ClientFactory)
  .build()
