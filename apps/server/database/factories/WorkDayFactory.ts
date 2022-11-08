import Factory from '@ioc:Adonis/Lucid/Factory'
import WorkDay from 'App/Models/WorkDay'

export default Factory.define(WorkDay, () => {
  return {
    name: 'Tuesday',
  }
}).build()
