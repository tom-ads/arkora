import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'budget_members'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().references('users.id')
      table.integer('budget_id').unsigned().references('budgets.id')

      table.unique(['user_id', 'budget_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
