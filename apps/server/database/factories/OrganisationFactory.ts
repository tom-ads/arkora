import Organisation from 'App/Models/Organisation'
import Factory from '@ioc:Adonis/Lucid/Factory'
import UserFactory from './UserFactory'
import CurrencyFactory from './CurrencyFactory'
import { DateTime } from 'luxon'
import WorkDayFactory from './WorkDayFactory'

export default Factory.define(Organisation, ({ faker }) => {
  const name = faker.company.name()
  return {
    name: name,
    subdomain: name,
    openingTime: DateTime.now().set({ hour: 9, minute: 0 }),
    closingTime: DateTime.now().set({ hour: 17, minute: 0 }),
    defaultRate: parseInt(faker.random.numeric(4), 10),
  }
})
  .relation('users', () => UserFactory)
  .relation('currency', () => CurrencyFactory)
  .relation('workDays', () => WorkDayFactory)
  .build()
