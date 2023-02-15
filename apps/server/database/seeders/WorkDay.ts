import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import WeekDay from 'App/Enum/WeekDay'
import WorkDay from 'App/Models/WorkDay'

export async function getWorkDays() {
  return await WorkDay.query()
}

export default class extends BaseSeeder {
  public async run() {
    await WorkDay.updateOrCreateMany(
      'name',
      Object.values(WeekDay).map((weekDay) => ({
        name: weekDay,
      }))
    )
  }
}
