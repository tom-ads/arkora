import BudgetType from 'App/Models/BudgetType'
import Factory from '@ioc:Adonis/Lucid/Factory'
import BudgetKind from 'App/Enum/BudgetKind'

const BudgetTypeFactory = Factory.define(BudgetType, () => {
  return {
    name: BudgetKind.VARIABLE,
  }
})
  .state('variable', (state) => (state.name = BudgetKind.VARIABLE))
  .state('fixed', (state) => (state.name = BudgetKind.FIXED))
  .state('nonBillable', (state) => (state.name = BudgetKind.NON_BILLABLE))
  .build()

export async function createBudgetTypes() {
  return await BudgetTypeFactory.merge([
    {
      name: BudgetKind.VARIABLE,
    },
    {
      name: BudgetKind.FIXED,
    },
    {
      name: BudgetKind.NON_BILLABLE,
    },
  ]).createMany(3)
}

export default BudgetTypeFactory
