import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'budget_notes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('budget_id').unsigned().references('budgets.id').onDelete('CASCADE')
      table.string('note')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
