import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Organisation from 'App/Models/Organisation'
import { getOriginSubdomain } from 'Helpers/subdomain'

export default class SubdomainsController {
  public async view({ request, response, organisation }: HttpContextContract) {
    console.log('testeerre')
    const originSubdomain = getOriginSubdomain(request?.header('origin')!)
    if (!originSubdomain) {
      response.notFound({ message: 'No organisation found' })
      return
    }

    organisation = await Organisation.findBy('subdomain', originSubdomain)
    if (!organisation) {
      response.notFound({ message: 'No organisation found' })
      return
    }

    return organisation.serialize()
  }
}
