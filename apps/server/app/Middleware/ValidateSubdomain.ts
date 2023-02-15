import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { getOriginSubdomain } from './../../helpers/subdomain'

/**
 *
 * Validate subdomain checks the organisation being requested
 * from the origin exists and is the auth users linked organisation.
 *
 * Subdomains are unique, so we can check against the name and not unique
 * primary key.
 */
export default class ValidateSubdomain {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // Check user is authenticated
    const auth = await ctx.auth.check()
    if (!auth || !ctx.auth?.user) {
      ctx.response.unauthorized({ message: 'Unauthenticated' })
      return
    }

    // Check the origin header is present in the request
    if (!ctx.request.header('origin')) {
      ctx.response.badRequest({ message: 'Missing Origin header' })
      return
    }

    // Check the origin contained a subdomain
    const originSubdomain = getOriginSubdomain(ctx.request.header('origin')!)
    if (!originSubdomain) {
      ctx.response.notFound({ message: 'Organisation does not exist' })
      return
    }

    // Check auth user organisation matches the request origin
    const userOrg = await ctx.auth.user?.related('organisation').query().first()
    if (userOrg?.subdomain !== originSubdomain) {
      ctx.response.notFound({ message: 'Organisation account does not exist' })
      return
    }

    ctx.organisation = userOrg

    await next()
  }
}
