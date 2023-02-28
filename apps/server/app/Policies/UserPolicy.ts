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
    if (!authUser || !user) {
      return false
    }

    // User can update themselves
    if (authUser.id === user.id) {
      return true
    }

    // authUser and user are of the same tenant
    if (authUser.organisationId !== user.organisationId) {
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

  public async view(authUser: User, user: User) {
    if (!authUser || !user) {
      return false
    }

    // User can update themselves
    if (authUser.id === user.id) {
      return true
    }

    // authUser and user are of the same tenant
    if (authUser.organisationId !== user.organisationId) {
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

  public async delete(authUser: User, user: User) {
    if (!authUser || !user) {
      return false
    }

    // User cannot delete themselves
    if (authUser.id === user.id) {
      return false
    }

    // authUser and user are of the same tenant
    if (authUser.organisationId !== user.organisationId) {
      return false
    }

    /*
      Members cannot delete other tenant users and admins can
      only delete tenant users of their own role or below.
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
