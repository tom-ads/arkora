import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'common_tasks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('organisation_id').unsigned().references('organisations.id').onDelete('CASCADE')
      table.string('name')
      table.boolean('is_billable').defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
