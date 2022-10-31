import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DetailsValidator from 'App/Validators/Auth/Register/DetailsValidator'
import OrganisationValidator from 'App/Validators/Auth/Register/OrganisationValidator'

export default class AuthController {
  public async verifyDetails({ request, response }: HttpContextContract) {
    await request.validate(DetailsValidator)
    return response.noContent()
  }

  public async verifyOrganisation({ request, response }: HttpContextContract) {
    await request.validate(OrganisationValidator)
    return response.noContent()
  }
}
