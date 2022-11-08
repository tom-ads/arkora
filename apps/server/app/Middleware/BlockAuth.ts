import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
  Named middleware to prevent auth users from accessing specific routes.
  ie. registering
*/
export default class BlockAuth {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (await auth.check()) {
      return response.forbidden()
    }

    await next()
  }
}
