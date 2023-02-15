import TimeEntry from 'App/Models/TimeEntry'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { DateTime } from 'luxon'
import BudgetFactory from './BudgetFactory'
import TaskFactory from './TaskFactory'
import UserFactory from './UserFactory'
import TimeSheetStatus from 'App/Enum/TimeSheetStatus'

export default Factory.define(TimeEntry, ({ faker }) => {
  return {
    date: DateTime.now(),
    description: faker.lorem.sentence(),
    durationMinutes: faker.datatype.number({ min: 0, max: 480 }),
    estimatedMinutes: faker.datatype.number({ min: 0, max: 480 }),
    lastStartedAt: DateTime.now().set({ millisecond: 0 }),
    lastStoppedAt: null,
    status: TimeSheetStatus.PENDING,
  }
})
  .state(
    'lastStoppedAt',
    (builder) =>
      (builder.lastStoppedAt = DateTime.now().plus({ minutes: 20 }).set({ millisecond: 0 }))
  )
  .relation('budget', () => BudgetFactory)
  .relation('task', () => TaskFactory)
  .relation('user', () => UserFactory)
  .build()
