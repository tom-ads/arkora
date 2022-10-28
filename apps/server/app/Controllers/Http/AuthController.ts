import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DetailsValidator from 'App/Validators/Auth/Register/DetailsValidator'

export default class AuthController {
  public async verifyDetails({ request, response }: HttpContextContract) {
    await request.validate(DetailsValidator)
    return response.noContent()
  }
}
