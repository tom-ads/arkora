import BudgetNote from 'App/Models/BudgetNote'
import Factory from '@ioc:Adonis/Lucid/Factory'
import BudgetFactory from './BudgetFactory'
import UserFactory from './UserFactory'

export default Factory.define(BudgetNote, ({ faker }) => {
  return {
    note: faker.lorem.lines(3),
  }
})
  .relation('budget', () => BudgetFactory)
  .relation('user', () => UserFactory)
  .build()
