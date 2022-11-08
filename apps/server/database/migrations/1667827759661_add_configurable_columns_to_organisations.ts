import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'organisations'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.time('opening_time').after('subdomain')
      table.time('closing_time').after('opening_time')
      table.bigInteger('default_rate').unsigned().after('closing_time')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('default_rate')
      table.dropColumn('closing_time')
      table.dropColumn('opening_time')
    })
  }
}
