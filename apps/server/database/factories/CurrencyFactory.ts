import Factory from '@ioc:Adonis/Lucid/Factory'
import Currency from 'App/Models/Currency'

export default Factory.define(Currency, ({ faker }) => {
  return {
    code: 'GBP',
    name: 'Great British Pounds',
    symbol: '£',
  }
}).build()
