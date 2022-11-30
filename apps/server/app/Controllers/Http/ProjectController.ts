import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'
import Project from 'App/Models/Project'
import CreateProjectValidator from 'App/Validators/Project/CreateProjectValidator'

export default class ProjectController {
  public async create(ctx: HttpContextContract) {
    await ctx.bouncer.with('ProjectPolicy').authorize('create')

    const payload = await ctx.request.validate(CreateProjectValidator)

    const nameExists = await ctx.organisation
      ?.related('projects')
      .query()
      .where('projects.name', payload.name)

    if (nameExists?.length) {
      ctx.response.unprocessableEntity({ name: { message: 'Project name already exists' } })
      return
    }

    const projectClient = await Client.findOrFail(payload.client_id)

    const createdProject = await Project.create({
      name: payload.name,
      showCost: payload.show_cost,
      private: payload.private,
    })
    await createdProject.related('client').associate(projectClient)

    let projectMembers: number[]

    // Get org users who need to be assigned to the new project
    if (payload.private) {
      const organisationAdmins = await ctx
        .organisation!.related('users')
        .query()
        .withScopes((scopes) => scopes.organisationAdmins())
        .whereNotIn('id', [ctx.auth.user!.id, ...(payload.team ?? [])])
      projectMembers = organisationAdmins.map((admin) => admin.id).concat(payload.team ?? [])
    } else {
      const organisationUsers = await ctx
        .organisation!.related('users')
        .query()
        .whereNot('id', ctx.auth.user!.id)
      projectMembers = organisationUsers.map((member) => member.id)
    }

    // Link project members to the new project
    await Promise.all(
      projectMembers.map(async (userId) => {
        await createdProject.related('members').attach([userId])
      })
    )

    return createdProject.serialize()
  }

  public async index(ctx: HttpContextContract) {
    const projects = await ctx.organisation
      ?.related('projects')
      .query()
      .preload('budgets')
      .preload('client')
      .preload('members')

    return {
      projects: projects?.map((project) => project.serialize()),
    }
  }
}
