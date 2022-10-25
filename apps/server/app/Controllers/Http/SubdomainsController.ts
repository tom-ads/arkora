import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Organisation from 'App/Models/Organisation'

export default class SubdomainsController {
  public async verifySubdomain({ request, response, organisation }: HttpContextContract) {
    organisation = await Organisation.findBy('subdomain', request.param('subdomain'))
    if (!organisation) {
      response.notFound({ message: 'No organisation found' })
      return
    }

    return response.ok({})
  }
}
