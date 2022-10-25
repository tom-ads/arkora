import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Organisation from 'App/Models/Organisation'
import { getOriginSubdomain } from 'Helpers/subdomain'

export default class SubdomainsController {
  public async verifySubdomain({ request, response, organisation }: HttpContextContract) {
    const originSubdomain = getOriginSubdomain(request?.header('origin')!)
    if (!originSubdomain) {
      response.notFound({ message: 'No subdomain found' })
      return
    }

    organisation = await Organisation.findBy('subdomain', originSubdomain)
    if (!organisation) {
      response.notFound({ message: 'No organisation found' })
      return
    }

    return response.ok({})
  }
}
