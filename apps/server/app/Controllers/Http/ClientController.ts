import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'
import CreateClientValidator from 'App/Validators/Client/CreateClientValidator'
import UpdateClientValidator from 'App/Validators/Client/UpdateClientValidator'
import { bind } from '@adonisjs/route-model-binding'

export default class ClientController {
  public async index(ctx: HttpContextContract) {
    await ctx.bouncer.with('ClientPolicy').authorize('index')

    await ctx.organisation?.load('clients')

    return ctx.organisation?.clients.map((client) => client.serialize())
  }

  @bind()
  public async view(ctx: HttpContextContract, client: Client) {
    console.log(client)
    await ctx.bouncer.with('ClientPolicy').authorize('view', client)

    return client.serialize()
  }

  public async create(ctx: HttpContextContract) {
    await ctx.bouncer.with('ClientPolicy').authorize('create')

    const payload = await ctx.request.validate(CreateClientValidator)

    const isNameTaken = await Client.isNameTaken(ctx.organisation!.id, payload.name)
    if (isNameTaken) {
      return ctx.response.unprocessableEntity({
        errors: [{ field: 'name', message: 'Name already taken' }],
      })
    }

    const createdClient = await ctx.organisation!.related('clients').create(payload)

    return createdClient.serialize()
  }

  @bind()
  public async update(ctx: HttpContextContract, client: Client) {
    await ctx.bouncer.with('ClientPolicy').authorize('update', client)

    const payload = await ctx.request.validate(UpdateClientValidator)

    if (payload?.name && payload?.name !== client.name) {
      client.name = payload.name
    }

    await client.save()

    return client.serialize()
  }

  @bind()
  public async delete(ctx: HttpContextContract, client: Client) {
    await ctx.bouncer.with('ClientPolicy').authorize('delete', client)

    await client.delete()

    return ctx.response.noContent()
  }
}
