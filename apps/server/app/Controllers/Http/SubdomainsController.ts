import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Organisation from 'App/Models/Organisation'
import { getOriginSubdomain } from 'Helpers/subdomain'

export default class SubdomainsController {
  public async view({ request, response, organisation }: HttpContextContract) {
    const originSubdomain = getOriginSubdomain(request?.header('origin')!)
    if (!originSubdomain) {
      return response.notFound({ message: 'No organisation found' })
    }

    organisation = await Organisation.findBy('subdomain', originSubdomain)
    if (!organisation) {
      return response.notFound({ message: 'No organisation found' })
    }

    return organisation.serialize()
  }
}
