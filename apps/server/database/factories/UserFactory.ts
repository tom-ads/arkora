import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import OrganisationFactory from './OrganisationFactory'
import RoleFactory from './RoleFactory'
import TimeEntryFactory from './TimeEntryFactory'
import BudgetFactory from './BudgetFactory'
import { DateTime } from 'luxon'

export default Factory.define(User, ({ faker }) => {
  return {
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    verifiedAt: DateTime.now().set({ millisecond: 0 }),
  }
})
  .relation('budgets', () => BudgetFactory)
  .relation('organisation', () => OrganisationFactory)
  .relation('timeEntries', () => TimeEntryFactory)
  .relation('role', () => RoleFactory)
  .build()
