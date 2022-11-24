import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import UserRole from 'App/Enum/UserRole'
import User from 'App/Models/User'

export default class ClientPolicy extends BasePolicy {
  /* 
 	  Owners and org admins can do perform all project actions.
  */
  public async before(user: User | null) {
    if (user && (user.role.name === UserRole.OWNER || user?.role.name === UserRole.ORG_ADMIN)) {
      return true
    }
  }

  public async index(user: User) {
    if (user.role.name === UserRole.MEMBER) {
      return false
    }

    return true
  }
}
