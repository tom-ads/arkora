import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Budget from 'App/Models/Budget'
import GetBudgetsValidator from 'App/Validators/Budget/GetBudgetsValidator'
import { groupBy } from 'lodash'

export default class BudgetController {
  public async index(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(GetBudgetsValidator)

    // Load budgets related to user
    await ctx.auth.user!.load('budgets')
    const budgets = ctx.auth.user!.budgets

    if (payload.group_by === 'PROJECT') {
      // Load budget projects and serailize each budget
      await Promise.all(budgets.map(async (budget) => await budget.load('project')))
      budgets.map((budget) => budget.serialize())

      // Group serialized budgets by related projects
      const groupedBudgets: Record<string, Budget[]> = groupBy(budgets, (p) => p.project.name)

      return groupedBudgets
    }

    return budgets.map((budget) => budget.serialize())
  }
}
