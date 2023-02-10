import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BillableType from 'App/Models/BillableType'
import Budget from 'App/Models/Budget'
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
        fixedPrice: payload.fixed_price,
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

    let budgets = await ctx.organisation?.getBudgets(
      {
        userId: payload?.user_id ?? ctx.auth.user!.id,
        projectId: payload?.project_id,
      },
      { includeProject: payload?.include_project }
    )

    if (!budgets?.length) {
      return ctx.response.ok([])
    }

    budgets = await Budget.getBudgetsMetrics(budgets.map((budget) => budget.id))

    return budgets?.map((budget) => budget.serialize())
  }
}
