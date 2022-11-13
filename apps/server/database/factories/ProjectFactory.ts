import Factory from '@ioc:Adonis/Lucid/Factory'
import Status from 'App/Enum/Status'
import Project from 'App/Models/Project'
import ClientFactory from './ClientFactory'

export default Factory.define(Project, ({ faker }) => {
  return {
    name: faker.company.name(),
    showCost: false,
    private: false,
    status: Status.ACTIVE,
  }
})
  .relation('client', () => ClientFactory)
  .build()
