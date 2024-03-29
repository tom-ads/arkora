import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { bind } from '@adonisjs/route-model-binding'
import GetAccountsValidator from 'App/Validators/Accounts/GetAccountsValidator'
import UpdateAccountValidator from 'App/Validators/Accounts/UpdateAccountValidator'
import Role from 'App/Models/Role'
import UserRole from 'App/Enum/UserRole'
import InsightsValidator from 'App/Validators/Project/InsightsValidator'
import Project from 'App/Models/Project'

export default class AccountController {
  public async index(ctx: HttpContextContract) {
    await ctx.bouncer.with('AccountPolicy').authorize('viewList')

    const payload = await ctx.request.validate(GetAccountsValidator)

    try {
      const team = await ctx.organisation!.getTeamMembers(payload)
      return team.map((member) => member.serialize())
    } catch (error) {
      ctx.logger.error(
        `Failed to fetch tenant(${ctx.organisation!.id}) team members, due to ${error.message}`
      )
      return ctx.response.internalServerError()
    }
  }

  @bind()
  public async view(ctx: HttpContextContract, user: User) {
    await ctx.bouncer.with('UserPolicy').authorize('view', user)

    return user.serialize()
  }

  @bind()
  public async update(ctx: HttpContextContract, user: User) {
    await ctx.bouncer.with('UserPolicy').authorize('update', user)

    const payload = await ctx.request.validate(UpdateAccountValidator)

    if (payload?.firstname && payload?.firstname !== user?.firstname) {
      user.firstname = payload.firstname
    }

    if (payload?.lastname && payload?.lastname !== user?.lastname) {
      user.lastname = payload.lastname
    }

    if (payload.email && payload?.email !== user?.email) {
      user.email = payload.email
    }

    // Only ORG_ADMIN and OWNER can change roles. Owner cannot change theirs.
    const authRole = ctx.auth.user?.role?.name
    if (
      (authRole === UserRole.ORG_ADMIN || authRole === UserRole.OWNER) &&
      user.role?.name !== UserRole.OWNER
    ) {
      if (payload.role && payload.role !== user.role?.name) {
        const newRole = await Role.findBy('name', payload.role)
        await user.related('role').associate(newRole!)
        await user.load('role')

        if (newRole?.name !== UserRole.MEMBER) {
          await Project.assignMemberToProjects(user, ctx.organisation!)
        }
      }
    }

    await user.save()

    return user.serialize()
  }

  @bind()
  public async delete(ctx: HttpContextContract, user: User) {
    await ctx.bouncer.with('UserPolicy').authorize('delete', user)

    await user.delete()

    return ctx.response.noContent()
  }

  public async insights(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(InsightsValidator)

    let users: User[] = []
    if (payload.project_id) {
      users = await User.getProjectInsights(ctx.auth.user!.organisationId, payload.project_id)
    }

    return users.map((user) => user.serialize())
  }
}
