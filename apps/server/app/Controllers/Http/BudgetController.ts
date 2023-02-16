import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BillableType from 'App/Models/BillableType'
import Budget from 'App/Models/Budget'
import BudgetType from 'App/Models/BudgetType'
import CreateBudgetValidator from 'App/Validators/Budget/CreateBudgetValidator'
import GetBudgetsValidator from 'App/Validators/Budget/GetBudgetsValidator'
import { bind } from '@adonisjs/route-model-binding'
import UpdateBudgetValidator from 'App/Validators/Budget/UpdateBudgetValidator'

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
    if (pivilegedUsers?.length) {
      await createdBudget.related('members').attach(pivilegedUsers.map((member) => member.id))
    }

    await ctx.organisation?.load('tasks')

    // Assign organisation default tasks to budget
    const defaultTasks = ctx.organisation?.tasks
    if (defaultTasks?.length) {
      await createdBudget.related('tasks').attach(
        defaultTasks.reduce((prev, curr) => {
          prev[curr.id] = { is_billable: Boolean(curr.$extras.pivot_is_billable) }
          return prev
        }, {})
      )
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

    budgets = await Budget.getBudgetsMetrics(
      budgets.map((budget) => budget.id),
      { page: payload.page }
    )

    return budgets
  }

  @bind()
  public async view(ctx: HttpContextContract, budget: Budget) {
    const relatedBudget = await ctx.organisation?.isRelatedBudget(budget.id)
    if (!relatedBudget) {
      return ctx.response.notFound()
    }

    await ctx.bouncer.with('BudgetPolicy').authorize('view', budget)

    const budgetWithMetrics = (await Budget.getBudgetMetrics(budget.id)) as Budget

    return budgetWithMetrics.serialize()
  }

  @bind()
  public async update(ctx: HttpContextContract, budget: Budget) {
    const relatedBudget = await ctx.organisation?.isRelatedBudget(budget.id)
    if (!relatedBudget) {
      return ctx.response.notFound()
    }

    await ctx.bouncer.with('BudgetPolicy').authorize('update', budget)

    const payload = await ctx.request.validate(UpdateBudgetValidator)

    if (payload.name !== budget.name) {
      budget.name = payload.name
    }

    if (payload.colour !== budget.colour) {
      budget.colour = payload.colour
    }

    if (payload.private !== budget.private) {
      budget.private = payload.private
    }

    if (payload.fixed_price !== budget.fixedPrice) {
      budget.fixedPrice = payload.fixed_price ?? null
    }

    if (payload.budget !== budget.budget) {
      budget.budget = payload.budget
    }

    if (payload.hourly_rate !== budget.hourlyRate) {
      budget.hourlyRate = payload.hourly_rate ?? null
    }

    if (payload.budget_type !== budget.budgetType?.name) {
      const newBudgetType = await BudgetType.findBy('name', payload.budget_type)
      if (newBudgetType) {
        await budget.related('budgetType').associate(newBudgetType)
      }
    }

    if (payload.billable_type !== budget.billableType?.name) {
      const newBillableType = await BillableType.findBy('name', payload.billable_type)
      if (newBillableType) {
        await budget.related('billableType').associate(newBillableType)
      }
    }

    await budget.save()

    const updatedBudget = await Budget.getBudgetMetrics(budget.id)

    return updatedBudget!.serialize()
  }

  @bind()
  public async delete(ctx: HttpContextContract, budget: Budget) {
    const relatedBudget = await ctx.organisation?.isRelatedBudget(budget.id)
    if (!relatedBudget) {
      return ctx.response.notFound()
    }

    await ctx.bouncer.with('BudgetPolicy').authorize('delete', budget)

    try {
      await budget.delete()
      ctx.logger.info(`Budget(${budget.id}) has been deleted from tenant ${ctx.organisation?.id}`)
    } catch (err) {
      ctx.logger.error(
        `Error occured while trying to delete Budget(${budget.id}) due to: ${err.message}`
      )
    }

    return ctx.response.noContent()
  }
}
