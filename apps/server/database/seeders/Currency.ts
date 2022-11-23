import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Currency from 'App/Models/Currency'
import { currencies } from 'Resources/currencies'

export default class extends BaseSeeder {
  public async run() {
    await Currency.updateOrCreateMany('code', currencies)
  }
}
