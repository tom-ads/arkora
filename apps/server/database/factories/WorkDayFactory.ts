import Factory from '@ioc:Adonis/Lucid/Factory'
import WeekDay from 'App/Enum/WeekDay'
import WorkDay from 'App/Models/WorkDay'

export default Factory.define(WorkDay, () => {
  return {
    name: WeekDay.MONDAY,
  }
}).build()
