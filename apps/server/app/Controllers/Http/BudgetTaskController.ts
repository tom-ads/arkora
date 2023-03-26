import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Budget from 'App/Models/Budget'
import Task from 'App/Models/Task'
import TimeEntry from 'App/Models/TimeEntry'
import UpdateBudgetTaskValidator from 'App/Validators/BudgetTask/UpdateBudgetTaskValidator'

export default class BudgetTaskController {
  @bind()
  public async delete(ctx: HttpContextContract, budget: Budget, task: Task) {
    await ctx.bouncer.with('BudgetPolicy').authorize('delete', budget)

    await TimeEntry.query().where('budget_id', budget.id).where('task_id', task.id).delete()

    await budget.related('tasks').detach([task.id])

    return ctx.response.noContent()
  }

  @bind()
  public async update(ctx: HttpContextContract, budget: Budget, task: Task) {
    await ctx.bouncer.with('BudgetPolicy').authorize('update', budget)

    const payload = await ctx.request.validate(UpdateBudgetTaskValidator)

    const budgetTask = await budget.related('tasks').query().where('tasks.id', task.id).first()
    if (!budgetTask) {
      return ctx.response.notFound()
    }

    if (payload.name !== budgetTask.name) {
      // TODO: prevent common tasks from being overridden

      // check not comon task
      budgetTask.name = payload.name
    }

    if (payload.is_billable !== budgetTask.$extras.is_billable) {
      await budget.related('tasks').attach({ [task.id]: { is_billable: payload.is_billable } })
    }

    await budgetTask.save()

    return budgetTask.serialize()
  }
}
