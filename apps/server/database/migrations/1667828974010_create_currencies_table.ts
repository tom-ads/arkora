import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'currencies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('code')
      table.string('name')
      table.string('symbol')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
