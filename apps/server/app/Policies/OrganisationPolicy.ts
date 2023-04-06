import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Organisation from 'App/Models/Organisation'
import UserRole from 'App/Enum/UserRole'

export default class OrganisationPolicy extends BasePolicy {
  public async update(user: User, organisation: Organisation) {
    if (!user || !organisation) {
      return false
    }

    const exists = await organisation.related('users').query().where('users.id', user.id).first()
    if (!exists) {
      return false
    }

    if (user?.role?.name === UserRole.MEMBER || user?.role?.name === UserRole.MANAGER) {
      return false
    }

    return true
  }

  public async delete(user: User, organisation: Organisation) {
    if (!user || !organisation) {
      return false
    }

    const exists = await organisation.related('users').query().where('users.id', user.id).first()
    if (!exists) {
      return false
    }

    if (user?.role?.name !== UserRole.OWNER) {
      return false
    }

    return true
  }
}
