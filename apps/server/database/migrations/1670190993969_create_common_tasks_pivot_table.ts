import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'common_tasks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('organisation_id').unsigned().references('organisations.id').onDelete('CASCADE')
      table.integer('task_id').unsigned().references('tasks.id').onDelete('CASCADE')
      table.boolean('is_billable').defaultTo(false)

      table.unique(['organisation_id', 'task_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
