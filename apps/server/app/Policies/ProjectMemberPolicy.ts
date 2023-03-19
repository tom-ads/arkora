import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import UserRole from 'App/Enum/UserRole'
import User from 'App/Models/User'

export default class ProjectMemberPolicy extends BasePolicy {
  public async create(authUser: User) {
    if (authUser.role?.name === UserRole.MEMBER) {
      return false
    }

    return true
  }

  public async delete(authUser: User, user: User) {
    // Must not be a member
    if (!user || authUser.role?.name === UserRole.MEMBER) {
      return false
    }

    // Must not be capable of deleting self
    if (authUser?.id === user.id) {
      return false
    }

    // Must be same tenant
    if (authUser.organisationId !== user.organisationId) {
      return false
    }

    const authRole = authUser.role?.name
    const userRole = user.role?.name

    // Must not have the same role
    if (authRole === userRole) {
      return false
    }

    if (
      // Must not allow managers to delete org_admins or owner
      authRole === UserRole.MANAGER &&
      (userRole === UserRole.ORG_ADMIN || userRole === UserRole.OWNER)
    ) {
      return false
    } else if (
      // Must not allow org_admins to delete owners
      authRole === UserRole.ORG_ADMIN &&
      userRole === UserRole.OWNER
    ) {
      return false
    }

    return true
  }
}
