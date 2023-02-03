import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BillableType from 'App/Models/BillableType'
import Budget from 'App/Models/Budget'
import { groupBy } from 'lodash'
import BudgetType from 'App/Models/BudgetType'
import CreateBudgetValidator from 'App/Validators/Budget/CreateBudgetValidator'
import GetBudgetsValidator from 'App/Validators/Budget/GetBudgetsValidator'

export default class BudgetController {
  public async create(ctx: HttpContextContract) {
    await ctx.bouncer.with('BudgetPolicy').authorize('create')

    const payload = await ctx.request.validate(CreateBudgetValidator)

    const budgetType = await BudgetType.getByName(payload.budget_type)

    let billableType: BillableType | null = null
    if (payload.billable_type) {
      billableType = await BillableType.getByName(payload.billable_type)
    }

    let createdBudget: Budget
    try {
      createdBudget = await Budget.create({
        projectId: payload.project_id,
        budgetTypeId: budgetType!.id,
        billableTypeId: billableType?.id,
        name: payload.name,
        colour: payload.colour,
        budget: payload.budget,
        hourlyRate: payload.hourly_rate,
        private: payload.private,
      })

      ctx.logger.info(`Created budget ${createdBudget.id} for tenant ${ctx.organisation!.id}`)
    } catch (err) {
      ctx.logger.error(
        `Error occured while attempting to create budget for tenant ${
          ctx.organisation!.id
        }, due to ${err.message}`
      )
      return ctx.response.internalServerError()
    }

    // Assign organisation administrators as default budget members
    const pivilegedUsers = await ctx.organisation?.getPrivilegedUsers()
    if (pivilegedUsers) {
      await createdBudget.related('members').attach(pivilegedUsers.map((member) => member.id))
    }

    return createdBudget.serialize()
  }

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
