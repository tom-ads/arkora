import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'organisation_workdays'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('organisation_id').unsigned().references('organisations.id')
      table.integer('workday_id').unsigned().references('work_days.id')

      table.unique(['organisation_id', 'workday_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
