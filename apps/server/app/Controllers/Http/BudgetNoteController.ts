import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Budget from 'App/Models/Budget'
import BudgetNote from 'App/Models/BudgetNote'
import CreateNoteValidator from 'App/Validators/budget_notes/CreateValidator'
import UpdateNoteValidator from 'App/Validators/budget_notes/UpdateValidator'

export default class BudgetNoteController {
  @bind()
  public async create(ctx: HttpContextContract, budget: Budget) {
    await ctx.bouncer.with('BudgetNotePolicy').authorize('create', budget)

    const payload = await ctx.request.validate(CreateNoteValidator)

    let createdNote: BudgetNote
    try {
      createdNote = await BudgetNote.create(payload)
      ctx.logger.info(`User(${ctx.auth.user?.id}) created note for budget(${budget.id})`)
    } catch (error) {
      ctx.logger.error(`Failed to create note for budget ${budget.id} due to ${error.message}`)
      return ctx.response.internalServerError()
    }

    return createdNote.serialize()
  }

  @bind()
  public async index(ctx: HttpContextContract, budget: Budget) {
    await ctx.bouncer.with('BudgetPolicy').authorize('view', budget)

    const notes = await budget.related('notes').query().orderBy('created_at')

    return notes?.map((note) => note.serialize())
  }

  @bind()
  public async view(ctx: HttpContextContract, budget: Budget, note: BudgetNote) {
    await ctx.bouncer.with('BudgetNotePolicy').authorize('view', budget, note)
    return note.serialize()
  }

  @bind()
  public async update(ctx: HttpContextContract, budget: Budget, note: BudgetNote) {
    await ctx.bouncer.with('BudgetNotePolicy').authorize('update', budget, note)

    const payload = await ctx.request.validate(UpdateNoteValidator)

    try {
      await note.merge({ note: payload.note }).save()
      await note.refresh()
      ctx.logger.info(`User(${ctx.auth.user?.id}) updated note(${note.id})`)
    } catch (error) {
      ctx.logger.error(`Failed to update note for budget ${budget.id} due to ${error.message}`)
      return ctx.response.internalServerError()
    }

    return note.serialize()
  }

  @bind()
  public async delete(ctx: HttpContextContract, budget: Budget, note: BudgetNote) {
    await ctx.bouncer.with('BudgetNotePolicy').authorize('delete', budget, note)

    try {
      await note.delete()
      ctx.logger.info(`User(${ctx.auth.user?.id}) deleted note for budget(${budget.id})`)
    } catch (error) {
      ctx.logger.error(`Failed to delete note for budget ${budget.id} due to ${error.message}`)
      return ctx.response.internalServerError()
    }

    return ctx.response.noContent()
  }
}
