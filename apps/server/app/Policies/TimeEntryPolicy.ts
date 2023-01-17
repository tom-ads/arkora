import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import TimeEntry from 'App/Models/TimeEntry'
import UserRole from 'App/Enum/UserRole'

export default class TimeEntryPolicy extends BasePolicy {
  public async update(user: User, timeEntry: TimeEntry) {
    if (!timeEntry) {
      return false
    }

    await timeEntry.load('user')
    if (user.organisationId !== timeEntry.user.organisationId) {
      return false
    }

    if (user.role.name === UserRole.MEMBER && user.id !== timeEntry.user.id) {
      return false
    }

    return true
  }
}
