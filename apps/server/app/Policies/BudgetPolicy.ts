import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import UserRole from 'App/Enum/UserRole'
import Budget from 'App/Models/Budget'
import Project from 'App/Models/Project'
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

    return true
  }

  public async create(user: User, project: Project) {
    if (!user || !project) {
      return false
    }

    if (user?.role?.name === UserRole.MEMBER) {
      return false
    }

    const exists = await project.related('members').query().where('user_id', user.id).first()
    if (!exists) {
      return false
    }

    return true
  }

  public async delete(user: User, budget: Budget) {
    if (!user?.id || !budget?.id) {
      return false
    }

    if (user.role?.name === UserRole.MEMBER) {
      return false
    }

    const exists = await budget.related('members').query().where('user_id', user.id).first()
    if (!exists) {
      return false
    }

    return true
  }

  public async update(user: User, budget: Budget) {
    if (!user?.id || !budget?.id) {
      return false
    }

    if (user.role?.name === UserRole.MEMBER) {
      return false
    }

    const exists = await budget.related('members').query().where('user_id', user.id).first()
    if (!exists) {
      return false
    }

    return true
  }
}
