import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Rate from 'App/Enum/Rate'
import RateType from 'App/Models/RateType'

export default class extends BaseSeeder {
  public async run() {
    await RateType.updateOrCreateMany(
      'name',
      Object.values(Rate).map((rateType) => ({
        name: rateType,
      }))
    )
  }
}
