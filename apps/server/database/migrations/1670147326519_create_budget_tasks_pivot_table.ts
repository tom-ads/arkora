import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'budget_tasks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('budget_id').unsigned().references('budgets.id').onDelete('CASCADE')
      table.integer('task_id').unsigned().references('tasks.id').onDelete('CASCADE')
      table.boolean('is_billable').defaultTo(false)

      table.unique(['budget_id', 'task_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
