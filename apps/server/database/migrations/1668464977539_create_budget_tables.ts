import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'budgets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('project_id').unsigned().references('projects.id')
      table.integer('budget_type_id').unsigned().references('budget_types.id')
      table.string('name')
      table.bigInteger('hourly_rate').unsigned().nullable()
      table.bigInteger('budget').unsigned().nullable()
      table.boolean('billable').defaultTo(false)
      table.boolean('private').defaultTo(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
