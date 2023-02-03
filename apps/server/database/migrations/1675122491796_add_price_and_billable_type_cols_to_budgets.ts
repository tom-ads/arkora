import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'budgets'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('billable_type_id')
        .unsigned()
        .references('billable_types.id')
        .nullable()
        .after('budget_type_id')

      table.bigInteger('fixed_price').unsigned().nullable().after('budget')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('fixed_price')

      table.dropForeign('billable_type_id')
      table.dropColumn('billable_type_id')
    })
  }
}
