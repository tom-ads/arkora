import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserRole from 'App/Enum/UserRole'
import Currency from 'App/Models/Currency'
import Organisation from 'App/Models/Organisation'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import WorkDay from 'App/Models/WorkDay'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import DetailsValidator from 'App/Validators/Auth/Register/DetailsValidator'
import OrganisationValidator from 'App/Validators/Auth/Register/OrganisationValidator'
import TeamValidator from 'App/Validators/Auth/Register/TeamValidator'
import { getOriginSubdomain } from 'Helpers/subdomain'
import Hash from '@ioc:Adonis/Core/Hash'
import ChangePasswordValidator from 'App/Validators/Auth/ChangePassword'
import { DateTime } from 'luxon'
import ForgotPasswordValidator from 'App/Validators/Auth/ForgotPassword'
import { string } from '@ioc:Adonis/Core/Helpers'
import { generatePasswordResetLink } from 'Helpers/links'
import PasswordReset from 'App/Models/PasswordReset'
import ResetPassword from 'App/Mailers/ResetPassword'
import ResetPasswordValidator from 'App/Validators/Auth/ResetPassword'
import { timerDifference } from 'Helpers/timer'
import CommonTask from 'App/Models/CommonTask'

export default class AuthController {
  public async verifyDetails({ request, response }: HttpContextContract) {
    await request.validate(DetailsValidator)
    return response.noContent()
  }

  public async verifyOrganisation({ request, response }: HttpContextContract) {
    await request.validate(OrganisationValidator)
    return response.noContent()
  }

  public async register(ctx: HttpContextContract) {
    // Revalidate each step of registration flow
    const [details, organisation, team] = await Promise.all([
      ctx.request.validate(DetailsValidator),
      ctx.request.validate(OrganisationValidator),
      ctx.request.validate(TeamValidator),
    ])

    const [currency, weekDays] = await Promise.all([
      Currency.findByOrFail('code', organisation.currency),
      WorkDay.query().withScopes((scopes) => scopes.workDayNames(organisation.business_days)),
    ])

    // Create organisation and relations
    let createdOrganisation: Organisation
    try {
      createdOrganisation = await Organisation.create({
        name: organisation.name,
        subdomain: organisation.subdomain,
        openingTime: organisation.opening_time,
        closingTime: organisation.closing_time,
        defaultRate: organisation.default_rate,
      })

      await Promise.all([
        createdOrganisation.related('currency').associate(currency),
        CommonTask.createDefaultTasks(createdOrganisation.id),
        createdOrganisation.related('workDays').sync(weekDays.map((weekDay) => weekDay.id)),
      ])

      ctx.logger.info(`Created Tenant: ${createdOrganisation.subdomain}`)
    } catch (err) {
      ctx.logger.error(`Failed to create new tenant due to: ${err.message}`)
      return ctx.response.internalServerError()
    }

    const userRoles = await Role.all()

    // Create organisation owner and relations
    let owner: User
    try {
      owner = await User.create({
        organisationId: createdOrganisation.id,
        firstname: details.firstname,
        lastname: details.lastname,
        email: details.email,
        password: details.password,
        verifiedAt: DateTime.now(),
      })
      await owner.related('role').associate(userRoles.find((r) => r.name === UserRole.OWNER)!)

      ctx.logger.info(`Created owner(${owner.id}) for tenant(${createdOrganisation.subdomain})`)
    } catch (err) {
      ctx.logger.error(
        `Registering tenant(${createdOrganisation.subdomain}) Owner account failed due to: ${err.message}`
      )
      return ctx.response.internalServerError()
    }

    // Prevent member list from trying to create owner again
    const filteredMembers = team.members?.filter((member) => member.email !== details.email)

    // Invite team members to organisation
    if (filteredMembers?.length) {
      try {
        await createdOrganisation.inviteMembers(filteredMembers)
      } catch (error) {
        ctx.logger.error(
          `Error occured while inviting members to tenant(${createdOrganisation.subdomain}) due to: ${error.message}`
        )
      }
    }

    ctx.logger.info(`Tenant(${createdOrganisation.subdomain}) has been onboarded`)

    return {
      user: owner.serialize(),
      organisation: createdOrganisation.serialize(),
    }
  }

  public async login(ctx: HttpContextContract) {
    const originSubdomain = getOriginSubdomain(ctx.request.header('origin')!)
    if (!originSubdomain) {
      ctx.response.notFound({ message: 'Origin header not present' })
      return
    }

    const payload = await ctx.request.validate(LoginValidator)

    const user = await User.query()
      .withScopes((scopes) => scopes.organisationUser(payload.email, originSubdomain))
      .preload('role')
      .first()

    if (!user || !(await Hash.verify(user?.password, payload.password))) {
      ctx.response.badRequest({ message: 'Email or password is incorrect' })
      return
    }

    const organisation = await Organisation.findByOrFail('subdomain', originSubdomain)

    await ctx.auth.login(user)

    let activeTimer = await ctx.auth.user!.getActiveTimer()
    if (activeTimer) {
      // Add timer duration difference
      const diffMinutes = timerDifference(activeTimer.lastStartedAt)
      activeTimer.durationMinutes += diffMinutes

      // If time exceeds daily entry duration, then stop it and don't return it
      if (activeTimer.isEntryDurationExceeded()) {
        await activeTimer.stopTimer()
        activeTimer = null
      }
    }

    return {
      user: user.serialize(),
      organisation: organisation?.serialize(),
      timer: activeTimer?.serialize(),
    }
  }

  public async logout(ctx: HttpContextContract) {
    // Prevent active timer from carrying on after logging out
    const timer = await ctx.auth.user!.getActiveTimer()
    if (timer) {
      await timer.stopTimer()
    }

    await ctx.auth.logout()

    return ctx.response.noContent()
  }

  public async session(ctx: HttpContextContract) {
    const organisation = await Organisation.findOrFail(ctx.auth.user?.organisationId)

    const originHeader = ctx.request.header('origin')?.toLowerCase()

    const originSubdomain = getOriginSubdomain(originHeader!)
    if (!originSubdomain || originSubdomain !== organisation.subdomain) {
      return ctx.response.abort({ message: 'Not authenticated' }, 401)
    }
    /* 
      Active timer could've been running while user was inactive,
      so the additional time needs to be added on, this does not
      persist to the DB. Additionally, the timer should not have
      run over the entry duration limit (24hrs)
    */
    let activeTimer = await ctx.auth.user!.getActiveTimer()
    if (activeTimer) {
      // Add timer duration difference
      const diffMinutes = timerDifference(activeTimer.lastStartedAt)
      activeTimer.durationMinutes += diffMinutes

      // If time exceeds daily entry duration, then stop it and don't return it
      if (activeTimer.isEntryDurationExceeded()) {
        await activeTimer.stopTimer()
        activeTimer = null
      }
    }

    return {
      user: ctx.auth.user?.serialize(),
      organisation: organisation.serialize(),
      timer: activeTimer?.serialize(),
    }
  }

  public async forgotPassword(ctx: HttpContextContract) {
    const originSubdomain = getOriginSubdomain(ctx.request.header('origin')!)
    if (!originSubdomain) {
      ctx.response.notFound({ message: 'Origin header not present' })
      return
    }

    const payload = await ctx.request.validate(ForgotPasswordValidator)

    const user = await User.query()
      .withScopes((scopes) => scopes.organisationUser(payload.email, originSubdomain))
      .first()

    if (user) {
      const organisation = await Organisation.findByOrFail('subdomain', originSubdomain)

      const token = string.generateRandom(32)
      const resetLink = generatePasswordResetLink(originSubdomain, user.id, token)

      try {
        // Create and send password reset notification
        await PasswordReset.create({ userId: user.id, token })
        await new ResetPassword(organisation, user, resetLink).send()

        ctx.logger.info(`Reset password link has been generated and sent to user(${user.id})`)
      } catch (error) {
        ctx.logger.error(
          `Failed to generate and send password reset link for user(${user.id}) due to: ${error.message}`
        )
      }
    }

    return ctx.response.ok({ message: 'Reset link was sent to this email address' })
  }

  public async resetPassword(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(ResetPasswordValidator)

    const user = await User.findOrFail(payload.user_id)

    const validToken = await PasswordReset.getUserToken(payload.user_id)

    if (!validToken) {
      return ctx.response.badRequest({ message: 'Password reset link has expired' })
    }

    if (!(await Hash.verify(validToken.token, payload.token))) {
      return ctx.response.unprocessableEntity({
        errors: [
          {
            field: 'passwordConfirmation',
            message: 'We cannot verify this reset link.',
          },
        ],
      })
    }

    await PasswordReset.invalidateUserTokens(user.id)

    return ctx.response.noContent()
  }

  public async changePassword(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(ChangePasswordValidator)

    const user = ctx.auth.user!

    if (!user || !(await Hash.verify(user?.password, payload.current_password))) {
      return ctx.response.unprocessableEntity({
        errors: [{ field: 'currentPassword', message: 'Old password does not match' }],
      })
    }

    // Model hook with automatically hash the password for us
    user.password = payload.new_password

    await user.save()

    return user.serialize()
  }
}
