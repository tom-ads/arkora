import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ClientController {
  public async index(ctx: HttpContextContract) {
    await ctx.bouncer.with('ClientPolicy').authorize('index')

    await ctx.organisation?.load('clients')

    return {
      clients: ctx.organisation?.clients.map((client) => client.serialize()),
    }
  }
}
