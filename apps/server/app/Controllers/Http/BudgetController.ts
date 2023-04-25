import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BillableType from 'App/Models/BillableType'
import Budget from 'App/Models/Budget'
import BudgetType from 'App/Models/BudgetType'
import CreateBudgetValidator from 'App/Validators/Budget/CreateBudgetValidator'
import GetBudgetsValidator from 'App/Validators/Budget/GetBudgetsValidator'
import { bind } from '@adonisjs/route-model-binding'
import UpdateBudgetValidator from 'App/Validators/Budget/UpdateBudgetValidator'
import BudgetKind from 'App/Enum/BudgetKind'
import CommonTask from 'App/Models/CommonTask'
import Project from 'App/Models/Project'

export default class BudgetController {
  public async create(ctx: HttpContextContract) {
    let project: Project
    if (ctx.request.input('project_id')) {
      project = await Project.findOrFail(ctx.request.input('project_id'))
    }

    await ctx.bouncer.with('BudgetPolicy').authorize('create', project!)

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

    // Assign project members based on the private flag
    await createdBudget.assignMembers()

    // Assign organisation default tasks to budget
    const organisationTasks = await CommonTask.getOrganisationTasks(ctx.organisation!.id)
    if (organisationTasks?.length) {
      await createdBudget
        .related('tasks')
        .createMany(
          organisationTasks.map((task) => ({ name: task.name, isBillable: task.isBillable }))
        )
    }

    return createdBudget.serialize()
  }

  public async index(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(GetBudgetsValidator)

    const budgets = await ctx.organisation?.getBudgets(
      {
        userId: payload?.user_id ?? ctx.auth.user!.id,
        projectId: payload?.project_id,
        projectStatus: payload.project_status,
      },
      { includeProject: payload?.include_project }
    )

    return budgets?.map((budget) => budget.serialize()) ?? []
  }

  @bind()
  public async view(ctx: HttpContextContract, budget: Budget) {
    const relatedBudget = await ctx.organisation?.isRelatedBudget(budget.id)
    if (!relatedBudget) {
      return ctx.response.notFound()
    }

    await ctx.bouncer.with('BudgetPolicy').authorize('view', budget)

    const budgetWithMetrics = await Budget.getMetricsForBudget(budget.id)

    return budgetWithMetrics?.serialize()
  }

  @bind()
  public async update(ctx: HttpContextContract, budget: Budget) {
    const relatedBudget = await ctx.organisation?.isRelatedBudget(budget.id)
    if (!relatedBudget) {
      return ctx.response.notFound()
    }

    await ctx.bouncer.with('BudgetPolicy').authorize('update', budget)

    const payload = await ctx.request.validate(UpdateBudgetValidator)

    budget.merge({
      name: payload.name,
      colour: payload.colour,
      fixedPrice: payload.fixed_price ?? null,
      budget: payload.budget ?? null,
      hourlyRate: payload.hourly_rate ?? null,
    })

    if (payload.private !== budget.private) {
      await budget.load('project')
      if (!payload.private) {
        const projectMembers = await budget.project.related('members').query()
        await budget.related('members').sync(projectMembers.map((member) => member.id))
      }

      budget.private = payload.private
    }

    if (payload.budget_type !== budget.budgetType?.name) {
      const newBudgetType = await BudgetType.findBy('name', payload.budget_type)
      if (newBudgetType) {
        await budget.related('budgetType').associate(newBudgetType)

        // All non-billable tasks related to budget need to be non-billable tasks
        if (payload.budget_type === BudgetKind.NON_BILLABLE) {
          await budget.related('tasks').query().update({ is_billable: false })
        }
      }
    }

    if (payload.billable_type !== budget.billableType?.name) {
      const newBillableType = await BillableType.findBy('name', payload.billable_type)
      if (newBillableType) {
        await budget.related('billableType').associate(newBillableType)
      }
    }

    await budget.save()

    const updatedBudget = await Budget.getMetricsForBudget(budget.id)

    return updatedBudget?.serialize()
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
