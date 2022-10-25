import Organisation from 'App/Models/Organisation'
import Factory from '@ioc:Adonis/Lucid/Factory'
import UserFactory from './UserFactory'

export default Factory.define(Organisation, ({ faker }) => {
  const name = faker.company.name()
  return {
    name: name,
    subdomain: name,
  }
})
  .relation('users', () => UserFactory)
  .build()
