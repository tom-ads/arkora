import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'budgets'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('billable')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('billable').defaultTo(false).after('budget')
    })
  }
}
