import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import OrganisationFactory from './OrganisationFactory'
import RoleFactory from './RoleFactory'

export default Factory.define(User, ({ faker }) => {
  return {
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
})
  .relation('organisation', () => OrganisationFactory)
  .relation('role', () => RoleFactory)
  .build()
