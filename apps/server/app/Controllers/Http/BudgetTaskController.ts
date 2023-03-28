import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Budget from 'App/Models/Budget'
import Task from 'App/Models/Task'
import TimeEntry from 'App/Models/TimeEntry'
import CreateBudgetTaskValidator from 'App/Validators/BudgetTask/CreateBudgetTaskValidator'
import UpdateBudgetTaskValidator from 'App/Validators/BudgetTask/UpdateBudgetTaskValidator'

export default class BudgetTaskController {
  @bind()
  public async create(ctx: HttpContextContract, budget: Budget) {
    await ctx.bouncer.with('BudgetPolicy').authorize('create')

    const payload = await ctx.request.validate(CreateBudgetTaskValidator)

    const budgetTask = await budget
      .related('tasks')
      .create({ name: payload.name, isBillable: payload.is_billable })

    return budgetTask.serialize()
  }

  @bind()
  public async index(ctx: HttpContextContract, budget: Budget) {
    await ctx.bouncer.with('BudgetPolicy').authorize('view', budget)

    const budgetTasks = await Task.getBudgetTasks(budget.id)

    return budgetTasks?.map((task) => task.serialize())
  }

  @bind()
  public async view(ctx: HttpContextContract, budget: Budget, task: Task) {
    await ctx.bouncer.with('BudgetPolicy').authorize('view', budget)

    const budgetTask = await budget.related('tasks').query().where('tasks.id', task.id).first()
    if (!budgetTask) {
      return ctx.response.notFound()
    }

    return budgetTask.serialize()
  }

  @bind()
  public async delete(ctx: HttpContextContract, budget: Budget, task: Task) {
    await ctx.bouncer.with('BudgetPolicy').authorize('delete', budget)

    await TimeEntry.query().where('budget_id', budget.id).where('task_id', task.id).delete()

    await budget.related('tasks').query().where('id', task.id).delete()

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
      budgetTask.name = payload.name
    }

    if (payload.is_billable !== budgetTask.isBillable) {
      await budget
        .related('tasks')
        .query()
        .where('tasks.id', task.id)
        .update({ is_billable: payload.is_billable })
    }

    await budgetTask.save()

    return budgetTask.serialize()
  }
}
