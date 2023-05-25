import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'organisations'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('break_duration').unsigned().after('closing_time').defaultTo(30)
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('break_duration')
    })
  }
}
