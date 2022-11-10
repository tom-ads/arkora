import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('role')

      table.integer('role_id').unsigned().references('roles.id').after('id')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('role_id')
      table.dropColumn('role_id')

      table.string('role').after('password')
    })
  }
}
