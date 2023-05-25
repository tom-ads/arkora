import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import TimeEntry from 'App/Models/TimeEntry'
import UserRole from 'App/Enum/UserRole'

export default class TimeEntryPolicy extends BasePolicy {
  public async update(authUser: User, timeEntry: TimeEntry) {
    if (!authUser || !timeEntry) {
      return false
    }

    const entryUser = await timeEntry.related('user').query().first()
    if (authUser?.organisationId !== entryUser?.organisationId) {
      return false
    }

    if (authUser.role?.name === UserRole.MEMBER && authUser.id !== entryUser.id) {
      return false
    }

    return true
  }

  public async view(authUser: User, timeEntry: TimeEntry) {
    if (!authUser || !timeEntry) {
      return false
    }

    const entryUser = await timeEntry.related('user').query().first()
    if (authUser?.organisationId !== entryUser?.organisationId) {
      return false
    }

    if (authUser.role?.name === UserRole.MEMBER && authUser.id !== entryUser.id) {
      return false
    }

    return true
  }

  public async delete(authUser: User, timeEntry: TimeEntry) {
    if (!authUser || !timeEntry) {
      return false
    }

    const entryUser = await timeEntry.related('user').query().first()
    if (authUser?.organisationId !== entryUser?.organisationId) {
      return false
    }

    if (authUser.role?.name === UserRole.MEMBER && authUser.id !== entryUser.id) {
      return false
    }

    return true
  }

  public async index(authUser: User) {
    if (!authUser) {
      return false
    }

    if (authUser.role?.name === UserRole.MEMBER) {
      return false
    }

    return true
  }
}
