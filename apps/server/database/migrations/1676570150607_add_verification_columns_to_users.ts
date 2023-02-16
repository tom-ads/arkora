import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('verification_code').nullable().after('password')
      table.datetime('verified_at').nullable().after('verification_code')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('verified_at')
      table.dropColumn('verification_code')
    })
  }
}
