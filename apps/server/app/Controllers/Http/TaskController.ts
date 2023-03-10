import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Budget from 'App/Models/Budget'
import Task from 'App/Models/Task'
import GetTasksValidator from 'App/Validators/Task/GetTasksValidator'

export default class TaskController {
  public async index(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(GetTasksValidator)

    let tasks: Task[] = []

    // Optionally filter tasks by budget
    if (payload.budget_id) {
      const budget = await Budget.findOrFail(payload.budget_id)

      await ctx.bouncer.with('BudgetPolicy').authorize('view', budget)

      await budget.load('tasks')
      tasks = budget.tasks
    } else {
      await ctx.organisation!.load('tasks')
      tasks = ctx.organisation!.tasks ?? []
    }

    return tasks.map((task) => task.serialize())
  }
}
