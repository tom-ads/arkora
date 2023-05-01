import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'time_entries'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.setNullable('last_stopped_at')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropNullable('last_stopped_at')
    })
  }
}
