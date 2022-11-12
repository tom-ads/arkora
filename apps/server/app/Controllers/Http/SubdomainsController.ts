import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Organisation from 'App/Models/Organisation'
import CheckSubdomainValidator from 'App/Validators/Subdomain/CheckSubdomainValidator'

export default class SubdomainsController {
  public async checkSubdomain({ request, response }: HttpContextContract) {
    const payload = await request.validate(CheckSubdomainValidator)

    const organisation = await Organisation.findBy('subdomain', payload.subdomain)

    return response.ok({
      exists: !!organisation,
      organisation: organisation?.serialize(),
    })
  }
}
