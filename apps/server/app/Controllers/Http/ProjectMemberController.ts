import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'
import User from 'App/Models/User'
import CreateMembersValidator from 'App/Validators/ProjectMember/CreateMembersValidator'
import GetMembersValidator from 'App/Validators/ProjectMember/GetMembersValidator'

export default class ProjectMemberController {
  @bind()
  public async index(ctx: HttpContextContract, project: Project) {
    await ctx.bouncer.with('ProjectPolicy').authorize('view', project)

    const payload = await ctx.request.validate(GetMembersValidator)

    const projectMembers = await project.getMetricsForMembers(payload)

    return projectMembers.map((member) => member.serialize())
  }

  @bind()
  public async create(ctx: HttpContextContract, project: Project) {
    await ctx.bouncer.with('ProjectMemberPolicy').authorize('create')

    const payload = await ctx.request.validate(CreateMembersValidator)

    await project.related('members').attach(payload.members)
    const updatedMembers = await project.related('members').query()

    return updatedMembers?.map((member) => member.serialize())
  }

  @bind()
  public async delete(ctx: HttpContextContract, project: Project, user: User) {
    await ctx.bouncer.with('ProjectMemberPolicy').authorize('delete', user)

    await project.unassignMember(user.id)

    return ctx.response.noContent()
  }
}
