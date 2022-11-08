import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'organisations'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('currency_id').unsigned().references('currencies.id').after('id')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('currency_id')
      table.dropColumn('currency_id')
    })
  }
}
