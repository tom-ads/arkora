import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelObject } from '@ioc:Adonis/Lucid/Orm'
import Budget from 'App/Models/Budget'
import Task from 'App/Models/Task'
import GetTasksValidator from 'App/Validators/Task/GetTasksValidator'
import { groupBy } from 'lodash'

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

    // Optionally group budgets by billable type
    if (payload.group_by === 'BILLABLE') {
      // TODO: Refactor into query that groups into billable / non-billable
      let groupedTasks = groupBy(
        tasks.map((task) => task.serialize()),
        (t: ModelObject) => t.is_billable
      )

      return Object.fromEntries(
        Object.entries(groupedTasks).map(([key, task]) => {
          return [key === 'true' ? 'billable' : 'non_billable', task]
        })
      )
    }

    return tasks.map((task) => task.serialize())
  }
}
