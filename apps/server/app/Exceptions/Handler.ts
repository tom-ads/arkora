/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { nodeEnv } from 'Config/app'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract): Promise<any> {
    if (error.code === 'E_ROW_NOT_FOUND') {
      return ctx.response.notFound({
        message: [{ message: 'Resource not found' }],
      })
    }

    if (error.code === 'E_CANNOT_FIND_ROUTE' || error.code === 'E_ROUTE_NOT_FOUND') {
      return ctx.response.notFound({
        message: [{ message: 'Route not found' }],
      })
    }

    if (error.code === 'E_AUTHORIZATION_FAILURE') {
      return ctx.response.forbidden({
        message: [{ message: 'Not authorized to perform this action' }],
      })
    }

    if (error.code === 'E_UNAUTHORIZED_ACCESS') {
      return ctx.response.unauthorized({
        message: [{ message: 'Unauthenticated. Please login.' }],
      })
    }

    if (ctx.response.getStatus() >= 500 && nodeEnv !== 'development') {
      return ctx.response.internalServerError({
        message: [{ message: 'Internal Server Error' }],
      })
    }

    return super.handle(error, ctx)
  }
}
