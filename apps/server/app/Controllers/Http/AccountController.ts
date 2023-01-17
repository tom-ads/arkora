import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import IndexValidator from 'App/Validators/Accounts/IndexValidator'

export default class AccountController {
  public async index(ctx: HttpContextContract) {
    await ctx.bouncer.with('AccountPolicy').authorize('viewList')

    const payload = await ctx.request.validate(IndexValidator)

    const organisationAccounts = await ctx.organisation
      ?.related('users')
      .query()
      .if(payload.role, (query) =>
        query.whereHas('role', (roleQuery) => roleQuery.where('name', payload.role!))
      )
      .whereNot('id', ctx.auth.user!.id)

    return {
      accounts: organisationAccounts?.map((member) => member.serialize()) ?? [],
    }
  }
}
