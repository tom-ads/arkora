import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import UserRole from 'App/Enum/UserRole'
import User from 'App/Models/User'

export default class AccountPolicy extends BasePolicy {
  /* 
 	  Owners and org admins can do perform all team actions.
  */
  public async before(user: User | null) {
    if (user && (user.role.name === UserRole.OWNER || user?.role.name === UserRole.ORG_ADMIN)) {
      return true
    }
  }

  /* 
 	  Check auth user can index organisation team members
  */
  public async viewList(user: User) {
    if (user.role.name === UserRole.MEMBER) {
      return false
    }

    return true
  }
}
