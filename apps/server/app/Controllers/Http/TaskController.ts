import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Budget from 'App/Models/Budget'
import Task from 'App/Models/Task'
import GetTasksValidator from 'App/Validators/Task/GetTasksValidator'

export default class TaskController {
  public async index(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(GetTasksValidator)

    if (payload.budget_id) {
      const budget = await Budget.findOrFail(payload.budget_id)
      await ctx.bouncer.with('BudgetPolicy').authorize('view', budget)

      const budgetTasks = await Task.getBudgetTasks(budget.id)
      return budgetTasks.map((budgetTask) => budgetTask.serialize())
    }

    await ctx.organisation!.load('commonTasks')
    const organisationTasks = ctx.organisation?.commonTasks ?? []

    return organisationTasks.map((task) => task.serialize())
  }
}
