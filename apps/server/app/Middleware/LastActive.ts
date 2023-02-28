import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'

export default class LastActiveMiddleware {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    const authUser = await auth.check()

    if (authUser) {
      if (auth.user!.lastActiveAt < DateTime.now().minus({ minutes: 5 })) {
        auth.user!.lastActiveAt = DateTime.now().toUTC()
        await auth.user!.save()
      }
    }

    await next()
  }
}
