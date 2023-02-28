import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Status from 'App/Enum/Status'
import Client from 'App/Models/Client'
import Project from 'App/Models/Project'
import User from 'App/Models/User'
import CreateProjectValidator from 'App/Validators/Project/CreateProjectValidator'
import UpdateProjectValidator from 'App/Validators/Project/UpdateProjectValidator'

export default class ProjectController {
  /**
   * @route POST api/v1/projects
   * @description Create a new organisation project
   *
   * @requestBody {string} name
   * @requestBody {number} client_id
   * @requestBody {boolean} private
   * @requestBody {boolean} show_cost
   * @requestBody {number[]} team
   *
   * @successStatus 200 - OK
   * @successResponse {Project}  Created project
   *
   * @errorResponse (401)  Unauthorized  Only authenticated users can create a project
   * @errorResponse (403)  Forbidden     Only admins can create a project
   * @errorResponse (404)  Not Found     Only organisation accounts can create a project
   */
  public async create(ctx: HttpContextContract) {
    await ctx.bouncer.with('ProjectPolicy').authorize('create')

    const payload = await ctx.request.validate(CreateProjectValidator)

    const nameExists = await ctx.organisation
      ?.related('projects')
      .query()
      .where('projects.name', payload.name)

    if (nameExists?.length) {
      ctx.response.unprocessableEntity({
        errors: [{ field: 'name', message: 'Name already exists' }],
      })
      return
    }

    const projectClient = await Client.findOrFail(payload.client_id)

    const createdProject = await Project.create({
      name: payload.name,
      showCost: payload.show_cost,
      private: payload.private,
      status: Status.ACTIVE,
    })
    await createdProject.related('client').associate(projectClient)

    const projectMembers: User[] = await ctx
      .organisation!.related('users')
      .query()
      .if(payload.private, (query) => query.withScopes((scope) => scope.organisationAdmins()))
      .exec()

    // Link project members to the new project
    await createdProject.related('members').attach(projectMembers.map((member) => member.id))

    return createdProject.serialize()
  }

  /**
   * @route GET api/v1/projects
   * @description Get a list of organisation projects
   *
   * @successStatus 200 - OK
   * @successResponse {Projects[]}  Created project
   *
   * @errorResponse (401) Unauthorized   Only authenticated users can get a list of projects
   * @errorResponse (403) Forbidden      Only organisation admins can get a list of projects
   * @errorResponse (404) Not Found      Only organisation accounts can get a list of projects
   */
  public async index(ctx: HttpContextContract) {
    const projects = await ctx.organisation
      ?.related('projects')
      .query()
      .preload('budgets')
      .preload('client')
      .preload('members', (query) => {
        query.whereNotNull('verified_at')
      })
      .orderBy('name', 'asc')

    return projects?.map((project) => project.serialize())
  }

  /**
   * @route PUT api/v1/projects/:projectId
   * @description Update an organisations project
   *
   * @requestBody {string} name
   * @requestBody {number} client_id
   * @requestBody {boolean} private
   * @requestBody {boolean} show_cost
   * @requestBody {number[]} team
   *
   * @successStatus 200 - OK
   * @successResponse {Project}  Updated Project
   *
   * @errorResponse (401)  Unauthorized          Only authenticated users can update a project
   * @errorResponse (403)  Forbidden             Only admins can update a project
   * @errorResponse (404)  Not Found             Only organisation accounts can update a project
   * @errorResponse (404)  Resource Not Found    Only existing oranigation projects can be updated
   */
  @bind()
  public async update(ctx: HttpContextContract, project: Project) {
    await ctx.bouncer.with('ProjectPolicy').authorize('update', project)

    const payload = await ctx.request.validate(UpdateProjectValidator)

    if (payload.name !== project.name) {
      project.name = payload.name
    }

    if (payload.private !== project.private) {
      project.private = payload.private
    }

    if (payload.show_cost !== project.showCost) {
      project.showCost = payload.show_cost
    }

    if (payload?.team?.length) {
      await project.assignProjectMembers(ctx.organisation!, project, payload.team ?? [])
    }

    await project.save()

    return project.serialize()
  }

  /**
   * @route GET api/v1/projects/:projectId
   * @description Get an organisations project
   *
   * @successStatus 200 - OK
   * @successResponse {Project}  Get Project
   *
   * @errorResponse (401)  Unauthorized          Only authenticated users can get a project
   * @errorResponse (403)  Forbidden             Only admins can get a project
   * @errorResponse (404)  Not Found             Only organisation accounts can get a project
   * @errorResponse (404)  Resource Not Found    Only existing organisation projects can be retreived
   */
  @bind()
  public async view(ctx: HttpContextContract, project: Project) {
    await ctx.bouncer.with('ProjectPolicy').authorize('view', project)

    await project.load('members')

    return project.serialize()
  }

  /**
   * @route DELETE api/v1/projects/:projectId
   * @description Delete an organisations project
   *
   * @successStatus 204 - No Content
   *
   * @errorResponse (401)  Unauthorized          Only authenticated users can delete a project
   * @errorResponse (403)  Forbidden             Only admins can delete a project
   * @errorResponse (404)  Not Found             Only organisation accounts can delete a project
   * @errorResponse (404)  Resource Not Found    Only existing organisation projects can be deleted
   */
  @bind()
  public async delete(ctx: HttpContextContract, project: Project) {
    await ctx.bouncer.with('ProjectPolicy').authorize('delete', project)

    await project.delete()

    return ctx.response.noContent()
  }
}
