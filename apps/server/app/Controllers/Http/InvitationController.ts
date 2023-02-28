import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Organisation from 'App/Models/Organisation'
import User from 'App/Models/User'
import VerifyInvitationValidator from 'App/Validators/Invitation/VerifyInvitationValidator'
import InvitationsValidator from 'App/Validators/Invitation/InvitationsValidator'
import { getOriginSubdomain } from 'Helpers/subdomain'
import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'
import { string } from '@ioc:Adonis/Core/Helpers'
import ResendInvitationValidator from 'App/Validators/Invitation/ResendInvitationValidator'
import OrganisationInvitation from 'App/Mailers/OrganisationInvitation'
import { uniqBy } from 'lodash'

export default class InvitationController {
  public async create(ctx: HttpContextContract) {
    await ctx.bouncer.with('UserPolicy').authorize('create')

    const payload = await ctx.request.validate(InvitationsValidator)

    const existingUsers = await ctx.organisation?.related('users').query()

    // Prevent invitee emails to already exist as organisation members
    const filteredInvites = uniqBy(payload.members, 'email').filter(
      (invitee) => !existingUsers?.some((user) => user.email === invitee.email)
    )

    if (filteredInvites?.length) {
      try {
        // Create and send organisation invitation notification
        const invitedMembers = await ctx.organisation!.inviteMembers(payload.members)

        // Link invited members to all associated entities, ie. public projects and budgets
        await ctx.organisation!.associateMembers(invitedMembers)
      } catch (error) {
        ctx.logger.error(
          `Error occured while inviting members to tenant(${ctx.organisation!.subdomain}) due to ${
            error.message
          }`
        )
      }
    }

    return ctx.response.noContent()
  }

  public async verify(ctx: HttpContextContract) {
    const originSubdomain = getOriginSubdomain(ctx.request.header('origin')!)
    if (!originSubdomain) {
      ctx.response.notFound({ message: 'Origin header not present' })
      return
    }

    const organisation = await Organisation.findByOrFail('subdomain', originSubdomain)

    const payload = await ctx.request.validate(VerifyInvitationValidator)

    // Verification code expires 1 day after its creation
    const invitedUser = await User.query()
      .where('email', payload.email)
      .where('updated_at', '>', DateTime.now().minus({ day: 1 }).toSQL())
      .whereHas('organisation', (subQuery) => {
        subQuery.where('id', organisation.id)
      })
      .first()

    if (invitedUser?.verifiedAt) {
      return ctx.response.badRequest({ message: 'Account already verified' })
    }

    if (!invitedUser || !(await Hash.verify(invitedUser.verificationCode!, payload.token))) {
      return ctx.response.badRequest({
        message: `${
          !invitedUser ? 'Your invitation has expired' : 'Unable to verify link'
        }. Please contact your administrator`,
      })
    }

    try {
      invitedUser.verificationCode = null
      invitedUser.verifiedAt = DateTime.now().set({ millisecond: 0 })
      invitedUser.firstname = payload.firstname
      invitedUser.lastname = payload.lastname
      invitedUser.password = payload.password // hook will hash automatically
      await invitedUser.save()

      ctx.logger.info(
        `Invited user(${invitedUser.id}) of tenant(${organisation!.subdomain}) has been onboarded`
      )
    } catch (error) {
      ctx.logger.error(
        `Failed to onboard user(${invitedUser.id}) of tenant(${organisation!.id}) due to: ${
          error.message
        }`
      )
    }

    await ctx.auth.login(invitedUser)

    return {
      user: invitedUser.serialize(),
      organisation: organisation.serialize(),
    }
  }

  public async resend(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(ResendInvitationValidator)

    const user = await User.findOrFail(payload.userId)

    await ctx.bouncer.with('UserPolicy').authorize('update', user)

    if (user?.verifiedAt) {
      return ctx.response.badRequest({ message: 'Account already verified' })
    }

    const invitationCode = string.generateRandom(32)
    user.verificationCode = invitationCode
    await user.save()

    await new OrganisationInvitation(ctx.organisation!, user, invitationCode).send()

    return ctx.response.noContent()
  }
}
