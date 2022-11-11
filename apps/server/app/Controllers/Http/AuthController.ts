import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserRole from 'App/Enum/UserRole'
import Currency from 'App/Models/Currency'
import Organisation from 'App/Models/Organisation'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import WorkDay from 'App/Models/WorkDay'
import DetailsValidator from 'App/Validators/Auth/Register/DetailsValidator'
import OrganisationValidator from 'App/Validators/Auth/Register/OrganisationValidator'
import TeamValidator from 'App/Validators/Auth/Register/TeamValidator'

export default class AuthController {
  public async verifyDetails({ request, response }: HttpContextContract) {
    await request.validate(DetailsValidator)
    return response.noContent()
  }

  public async verifyOrganisation({ request, response }: HttpContextContract) {
    await request.validate(OrganisationValidator)
    return response.noContent()
  }

  public async register({ request }: HttpContextContract) {
    // Revalidate each step of registration flow
    const [details, organisation, team] = await Promise.all([
      request.validate(DetailsValidator),
      request.validate(OrganisationValidator),
      request.validate(TeamValidator),
    ])

    const [currency, weekDays] = await Promise.all([
      Currency.findByOrFail('code', organisation.currency),
      WorkDay.query().withScopes((scopes) => scopes.workDayNames(organisation.work_days)),
    ])

    // Create organisation and relations
    const createdOrganisation = await Organisation.create({
      name: organisation.name,
      subdomain: organisation.subdomain,
      openingTime: organisation.opening_time,
      closingTime: organisation.closing_time,
      defaultRate: organisation.hourly_rate,
    })
    await createdOrganisation.related('currency').associate(currency)
    await createdOrganisation.related('workDays').sync(weekDays.map((p) => p.id))

    const userRoles = await Role.all()

    // Create account owner
    const owner = await User.create({
      firstname: details.firstname,
      lastname: details.lastname,
      email: details.email,
      password: details.password,
    })

    await owner.related('role').associate(userRoles.find((r) => r.name === UserRole.OWNER)!)
    await owner.related('organisation').associate(createdOrganisation)

    // Prevent member list from trying to create owner again
    const filteredMembers = team.members?.filter((member) => member.email !== details.email)

    // Create & Invite Team members
    if (filteredMembers?.length) {
      const invitedMembers = await User.createMany(
        filteredMembers.map((member) => ({
          email: member.email,
        }))
      )

      await Promise.all(
        invitedMembers.map(async (member) => {
          const role = userRoles.find(
            (role) => role.name === filteredMembers?.find((m) => m.email === member.email)?.role
          )

          await member.related('role').associate(role!)
          await member.related('organisation').associate(createdOrganisation)

          // TODO: Invite notification
        })
      )
    }

    return {
      user: owner.serialize(),
      organisation: createdOrganisation.serialize(),
    }
  }
}
