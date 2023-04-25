import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import BudgetNote from 'App/Models/BudgetNote'
import Budget from 'App/Models/Budget'
import UserRole from 'App/Enum/UserRole'

export default class BudgetNotePolicy extends BasePolicy {
  public async before(user: User | null) {
    if (!user) {
      return false
    }

    if (user?.role?.name === UserRole.MEMBER) {
      return false
    }
  }

  public async create(user: User, budget: Budget) {
    if (!budget) {
      return false
    }

    const isBudgetMember = await budget.related('members').query().where('user_id', user.id).first()
    if (!isBudgetMember) {
      return false
    }

    return true
  }

  public async index(user: User, budget: Budget) {
    if (!budget) {
      return false
    }

    const isBudgetMember = await budget.related('members').query().where('user_id', user.id).first()
    if (!isBudgetMember) {
      return false
    }

    return true
  }

  public async view(user: User, budget: Budget, note: BudgetNote) {
    if (!budget || !note) {
      return false
    }

    const isBudgetMember = await budget.related('members').query().where('user_id', user.id).first()
    if (!isBudgetMember) {
      return false
    }

    if (note.budgetId !== budget.id) {
      return false
    }

    return true
  }

  public async update(user: User, budget: Budget, note: BudgetNote) {
    if (!budget || !note) {
      return false
    }

    const isBudgetMember = await budget.related('members').query().where('user_id', user.id).first()
    if (!isBudgetMember) {
      return false
    }

    if (note.budgetId !== budget.id) {
      return false
    }

    return true
  }
  public async delete(user: User, budget: Budget, note: BudgetNote) {
    if (!budget || !note) {
      return false
    }

    const isBudgetMember = await budget.related('members').query().where('user_id', user.id).first()
    if (!isBudgetMember) {
      return false
    }

    if (note.budgetId !== budget.id) {
      return false
    }

    return true
  }
}
