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
import InvitationValidator from 'App/Validators/Auth/InvitationValidator'
import TeamValidator from 'App/Validators/Auth/Register/TeamValidator'
import { getOriginSubdomain, getTenantHostname } from 'Helpers/subdomain'
import Hash from '@ioc:Adonis/Core/Hash'
import Task from 'App/Models/Task'
import { string } from '@ioc:Adonis/Core/Helpers'
import { DateTime } from 'luxon'
import OrganisationInvitation from 'App/Mailers/OrganisationInvitation'
import { generateInvitiationUrl } from 'Helpers/links'

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

    const [currency, weekDays, commonTasks] = await Promise.all([
      Currency.findByOrFail('code', organisation.currency),
      WorkDay.query().withScopes((scopes) => scopes.workDayNames(organisation.work_days)),
      Task.getCommonTasks(),
    ])

    // Create organisation and relations
    let createdOrganisation: Organisation
    try {
      createdOrganisation = await Organisation.create({
        name: organisation.name,
        subdomain: organisation.subdomain,
        openingTime: organisation.opening_time,
        closingTime: organisation.closing_time,
        defaultRate: organisation.hourly_rate,
      })

      await Promise.all([
        createdOrganisation.related('currency').associate(currency),
        createdOrganisation.related('tasks').sync(commonTasks.map((task) => task.id)),
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
        firstname: details.firstname,
        lastname: details.lastname,
        email: details.email,
        password: details.password,
        verificationCode: string.generateRandom(32),
      })
      await owner.related('role').associate(userRoles.find((r) => r.name === UserRole.OWNER)!)
      await owner.related('organisation').associate(createdOrganisation)

      // TODO: send owner a verification link

      ctx.logger.info(`Created tenant Owner with id: ${owner.id}`)
    } catch (err) {
      ctx.logger.error(
        `Registering tenant (${createdOrganisation.subdomain}) Owner account failed due to: ${err.message}`
      )
      return ctx.response.internalServerError()
    }

    // Prevent member list from trying to create owner again
    const filteredMembers = team.members?.filter((member) => member.email !== details.email)

    // Create & Invite Team members
    if (filteredMembers?.length) {
      const invitedMembers = await User.createMany(
        filteredMembers.map((member) => ({
          email: member.email,
          verificationCode: string.generateRandom(32),
        }))
      )

      await Promise.all(
        invitedMembers.map(async (member) => {
          const role = userRoles.find(
            (role) => role.name === filteredMembers?.find((m) => m.email === member.email)?.role
          )

          await member.related('role').associate(role!)
          await member.related('organisation').associate(createdOrganisation)

          await new OrganisationInvitation(
            ctx.organisation!,
            ctx.auth.user!,
            generateInvitiationUrl(
              getTenantHostname(ctx.organisation!.subdomain),
              ctx.auth.user!.email,
              string.generateRandom(32)
            )
          ).send()
        })
      )
    }

    ctx.logger.info(`Tenant (${createdOrganisation.subdomain}) has been onboarded`)

    await ctx.auth.login(owner)

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

    return {
      user: user.serialize(),
      organisation: organisation?.serialize(),
      timer: await ctx.auth.user!.getActiveTimer(),
    }
  }

  public async session(ctx: HttpContextContract) {
    await ctx.auth.user?.load('organisation')

    return {
      user: ctx.auth.user,
      organisation: ctx.auth.user?.organisation,
      timer: await ctx.auth.user!.getActiveTimer(),
    }
  }

  public async verifyInvitation(ctx: HttpContextContract) {
    const originSubdomain = getOriginSubdomain(ctx.request.header('origin')!)
    if (!originSubdomain) {
      ctx.response.notFound({ message: 'Origin header not present' })
      return
    }

    const organisation = await Organisation.findByOrFail('subdomain', originSubdomain)

    const payload = await ctx.request.validate(InvitationValidator)

    // Verification code expires 1 day after its creation
    const invitedUser = await User.query()
      .where('email', payload.email)
      .where('updated_at', '>', DateTime.now().minus({ day: 1 }).toSQL())
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

    invitedUser.verificationCode = null
    invitedUser.verifiedAt = DateTime.now().set({ millisecond: 0 })
    invitedUser.firstname = payload.firstname
    invitedUser.lastname = payload.lastname
    invitedUser.password = payload.password // hook will hash automatically
    await invitedUser.save()

    await ctx.auth.login(invitedUser)

    return {
      user: invitedUser.serialize(),
      organisation: organisation.serialize(),
    }
  }
}
