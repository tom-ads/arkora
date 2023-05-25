import Organisation from 'App/Models/Organisation'
import Factory from '@ioc:Adonis/Lucid/Factory'
import UserFactory from './UserFactory'
import CurrencyFactory from './CurrencyFactory'
import { DateTime } from 'luxon'
import WorkDayFactory from './WorkDayFactory'
import ClientFactory from './ClientFactory'
import TaskFactory from './TaskFactory'

export default Factory.define(Organisation, ({ faker }) => {
  const name = faker.company.name()
  return {
    name: name,
    subdomain: 'test-org',
    openingTime: DateTime.now().set({ hour: 9, minute: 0, second: 0 }),
    closingTime: DateTime.now().set({ hour: 17, minute: 0, second: 0 }),
    defaultRate: 10000,
    breakDuration: 30,
  }
})
  .relation('users', () => UserFactory)
  .relation('currency', () => CurrencyFactory)
  .relation('workDays', () => WorkDayFactory)
  .relation('clients', () => ClientFactory)
  .relation('commonTasks', () => TaskFactory)
  .build()
