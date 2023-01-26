import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import UserRole from 'App/Enum/UserRole'
import Budget from 'App/Models/Budget'
import User from 'App/Models/User'

export default class BudgetPolicy extends BasePolicy {
  public async view(user: User, budget: Budget) {
    if (!user?.id || !budget?.id) {
      return false
    }

    const exists = await budget.related('members').query().where('user_id', user.id).first()
    if (!exists) {
      return false
    }

    // TODO: Check organisation id of user vs budget

    return true
  }

  public async create(user: User) {
    if (user.role.name === UserRole.MEMBER) {
      return false
    }

    return true
  }
}
