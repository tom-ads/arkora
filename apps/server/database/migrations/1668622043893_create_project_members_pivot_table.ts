import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'project_members'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('project_id').unsigned().references('projects.id').onDelete('CASCADE')

      table.unique(['user_id', 'project_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
