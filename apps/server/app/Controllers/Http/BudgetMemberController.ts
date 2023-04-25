import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Budget from 'App/Models/Budget'
import User from 'App/Models/User'
import CreateBudgetMemberValidator from 'App/Validators/BudgetMember/CreateMemberValidator'
import GetBudgetMembersValidator from 'App/Validators/BudgetMember/GetMembersValidator'

export default class BudgetMemberController {
  @bind()
  public async index(ctx: HttpContextContract, budget: Budget) {
    await ctx.bouncer.with('BudgetPolicy').authorize('view', budget)

    const payload = await ctx.request.validate(GetBudgetMembersValidator)

    const budgetMembers = await budget.getMetricsForMembers(payload)

    return budgetMembers?.map((member) => member.serialize())
  }

  @bind()
  public async create(ctx: HttpContextContract, budget: Budget) {
    const project = await budget.related('project').query().first()

    await ctx.bouncer.with('BudgetPolicy').authorize('create', project!)

    const payload = await ctx.request.validate(CreateBudgetMemberValidator)

    // Attach member(s) to budget
    await budget.related('members').attach(payload.members)
    const updatedMembers = await budget.related('members').query()

    return updatedMembers?.map((member) => member.serialize())
  }

  @bind()
  public async delete(ctx: HttpContextContract, budget: Budget, member: User) {
    await ctx.bouncer.with('BudgetPolicy').authorize('delete', budget)

    // Delete time entries for member against this budget
    await budget.related('timeEntries').query().where('user_id', member.id).delete()

    // Unassign member from budget
    await budget.related('members').detach([member.id])

    return ctx.response.noContent()
  }
}
