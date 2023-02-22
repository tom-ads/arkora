import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import UserRole from 'App/Enum/UserRole'
import User from 'App/Models/User'

export default class UserPolicy extends BasePolicy {
  public async create(authUser: User) {
    if (!authUser || authUser.role?.name === UserRole.MEMBER) {
      return false
    }

    return true
  }

  public async update(authUser: User, user: User) {
    // User can update themselves
    if (authUser.id === user.id) {
      return true
    }

    // authUser and user are of the same tenant
    const isSameTenant = await authUser
      .related('organisation')
      .query()
      .whereHas('users', (subQuery) => {
        subQuery.where('id', user.id)
      })
      .first()
    if (!isSameTenant) {
      return false
    }

    /*
      Members cannot update other tenant users and admins can
      only update tenant users of their own role or below.
    */
    const authUserRole = authUser.role?.name
    const userRole = user.role?.name
    if (authUserRole === UserRole.MEMBER) {
      return false
    } else if (
      authUserRole === UserRole.MANAGER &&
      (userRole === UserRole.ORG_ADMIN || userRole === UserRole.OWNER)
    ) {
      return false
    } else if (authUserRole === UserRole.ORG_ADMIN && userRole === UserRole.OWNER) {
      return false
    }

    return true
  }
}
