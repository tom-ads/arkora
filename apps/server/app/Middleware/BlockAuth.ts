import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
  Named middleware to prevent auth users from accessing specific routes.
  ie. registering
*/
export default class BlockAuth {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    if (await ctx.auth.check()) {
      return ctx.response.forbidden()
    }

    await next()
  }
}
