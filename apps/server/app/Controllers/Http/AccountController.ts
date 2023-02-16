import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GetAccountsValidator from 'App/Validators/Accounts/GetAccountsValidator'

export default class AccountController {
  public async index(ctx: HttpContextContract) {
    await ctx.bouncer.with('AccountPolicy').authorize('viewList')

    const payload = await ctx.request.validate(GetAccountsValidator)

    try {
      const team = await ctx.organisation!.getTeamMembers(ctx.auth.user!.id, payload)
      return team.map((member) => member.serialize())
    } catch (error) {
      ctx.logger.error(
        `Failed to fetch tenant(${ctx.organisation!.id}) team members, due to ${error.message}`
      )
      return ctx.response.internalServerError()
    }
  }
}
