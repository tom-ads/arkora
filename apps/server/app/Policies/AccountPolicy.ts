import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import UserRole from 'App/Enum/UserRole'
import User from 'App/Models/User'

export default class AccountPolicy extends BasePolicy {
  public async viewList(user: User) {
    if (!user) {
      return false
    }

    if (user.role.name === UserRole.MEMBER) {
      return false
    }

    return true
  }
}
