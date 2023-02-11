import Factory from '@ioc:Adonis/Lucid/Factory'
import BillableKind from 'App/Enum/BillableKind'
import BillableType from 'App/Models/BillableType'

const BillableTypeFactory = Factory.define(BillableType, () => {
  return {
    name: BillableKind.TOTAL_COST,
  }
})
  .state('total_hours', (state) => (state.name = BillableKind.TOTAL_HOURS))
  .state('total_cost', (state) => (state.name = BillableKind.TOTAL_COST))
  .build()

export async function createBillableTypes() {
  return await BillableTypeFactory.merge([
    {
      name: BillableKind.TOTAL_COST,
    },
    {
      name: BillableKind.TOTAL_HOURS,
    },
  ]).createMany(2)
}

export default BillableTypeFactory
