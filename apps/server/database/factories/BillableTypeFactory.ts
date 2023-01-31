import Factory from '@ioc:Adonis/Lucid/Factory'
import BillableKind from 'App/Enum/BillableKind'
import BillableType from 'App/Models/BillableType'

export default Factory.define(BillableType, () => {
  return {
    name: BillableKind.TOTAL_COST,
  }
})
  .state('total_hours', (state) => (state.name = BillableKind.TOTAL_HOURS))
  .build()
