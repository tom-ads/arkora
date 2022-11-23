import BudgetType from 'App/Models/BudgetType'
import Factory from '@ioc:Adonis/Lucid/Factory'
import BudgetKind from 'App/Enum/BudgetKind'

export default Factory.define(BudgetType, () => {
  return {
    name: BudgetKind.HOURLY,
  }
}).build()
