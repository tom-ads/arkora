import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import BillableKind from 'App/Enum/BillableKind'
import BillableType from 'App/Models/BillableType'

export async function getBillableType() {
  return await BillableType.query()
}

export default class extends BaseSeeder {
  public async run() {
    await BillableType.updateOrCreateMany(
      'name',
      Object.values(BillableKind).map((billableType) => ({
        name: billableType,
      }))
    )
  }
}
