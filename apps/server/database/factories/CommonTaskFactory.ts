import Factory from '@ioc:Adonis/Lucid/Factory'
import CommonTask from 'App/Models/CommonTask'
import OrganisationFactory from './OrganisationFactory'

export default Factory.define(CommonTask, () => {
  return {
    name: 'Development',
    isBillable: false,
  }
})
  .relation('organisations', () => OrganisationFactory)
  .build()
