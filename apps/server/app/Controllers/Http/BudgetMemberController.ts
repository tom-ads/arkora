import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Budget from 'App/Models/Budget'
import User from 'App/Models/User'
import CreateBudgetMemberValidator from 'App/Validators/BudgetMember/CreateMemberValidator'

export default class BudgetMemberController {
  @bind()
  public async index(ctx: HttpContextContract, budget: Budget) {
    await ctx.bouncer.with('BudgetPolicy').authorize('view', budget)

    const budgetMembers = await budget.getMetricsForMembers()

    return budgetMembers.map((member) => member.serialize())
  }

  @bind()
  public async create(ctx: HttpContextContract, budget: Budget) {
    await ctx.bouncer.with('BudgetPolicy').authorize('create')

    const payload = await ctx.request.validate(CreateBudgetMemberValidator)

    await budget.related('members').attach(payload.members)
    const updatedMembers = await budget.related('members').query()

    return updatedMembers.map((member) => member.serialize())
  }

  @bind()
  public async delete(ctx: HttpContextContract, budget: Budget, member: User) {
    await ctx.bouncer.with('BudgetPolicy').authorize('delete', budget)

    await budget.related('members').detach([member.id])

    // TODO: remove time entries?

    return ctx.response.noContent()
  }
}
