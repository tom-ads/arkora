import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { CommonTask } from 'App/Enum/CommonTask'
import Task from 'App/Models/Task'

export async function getCommonTasks() {
  return await Task.query().whereIn('name', Object.values(CommonTask))
}

export default class extends BaseSeeder {
  public async run() {
    await Task.updateOrCreateMany(
      'name',
      Object.values(CommonTask).map((task) => ({
        name: task,
      }))
    )
  }
}
