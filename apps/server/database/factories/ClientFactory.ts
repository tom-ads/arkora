import Client from 'App/Models/Client'
import Factory from '@ioc:Adonis/Lucid/Factory'
import OrganisationFactory from './OrganisationFactory'
import ProjectFactory from './ProjectFactory'

export default Factory.define(Client, ({ faker }) => {
  return {
    name: faker.company.name(),
  }
})
  .relation('organisation', () => OrganisationFactory)
  .relation('projects', () => ProjectFactory)
  .build()
