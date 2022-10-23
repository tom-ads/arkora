import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('organisation_id')
        .unsigned()
        .references('organisations.id')
        .onDelete('cascade')
        .after('role_id')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('organisation_id')
      table.dropColumn('organisation_id')
    })
  }
}
