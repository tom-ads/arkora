import Factory from '@ioc:Adonis/Lucid/Factory'
import { DefaultTask } from 'App/Enum/DefaultTask'
import CommonTask from 'App/Models/CommonTask'
import OrganisationFactory from './OrganisationFactory'

export default Factory.define(CommonTask, () => {
  return {
    name: DefaultTask.DEVELOPMENT,
    isBillable: false,
  }
})
  .relation('organisation', () => OrganisationFactory)
  .build()
