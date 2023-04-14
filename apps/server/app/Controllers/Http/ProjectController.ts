import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Status from 'App/Enum/Status'
import UserRole from 'App/Enum/UserRole'
import Client from 'App/Models/Client'
import Project from 'App/Models/Project'
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

    const nameTaken = await Project.isNameTaken(ctx.organisation!, payload.name)
    if (nameTaken) {
      return ctx.response.unprocessableEntity({
        errors: [{ field: 'name', message: 'Name already taken' }],
      })
    }

    let createdProject: Project
    try {
      createdProject = await Project.create({
        name: payload.name,
        clientId: payload.client_id,
        showCost: payload.show_cost,
        private: payload.private,
        status: Status.ACTIVE,
      })

      ctx.logger.info(`Created project for tenant(${ctx.organisation!.id})`)
    } catch (error) {
      ctx.logger.error(
        `Failed to create project for tenant(${ctx.organisation!.id}), due to ${error.message}`
      )
      return ctx.response.internalServerError()
    }

    await createdProject.assignMembers(ctx.organisation!)

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
    const projects = await ctx.auth.user
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
      const nameTaken = await Project.isNameTaken(ctx.organisation!, payload.name, project.id)
      if (nameTaken) {
        return ctx.response.unprocessableEntity({
          errors: [{ field: 'name', message: 'Name already taken' }],
        })
      }

      project.name = payload.name
    }

    if (payload.client_id !== project.clientId) {
      const client = await Client.find(payload.client_id)
      await project.related('client').associate(client!)
    }

    if (payload.private !== project.private) {
      project.private = payload.private

      // Ensure all members are added to project if made public
      if (!project.private) {
        const members = await ctx.organisation?.related('users').query()
        await project.related('members').sync(members?.map((member) => member.id) ?? [])
      }
    }

    if (payload.show_cost !== project.showCost) {
      project.showCost = payload.show_cost
    }

    await project.save()
    await project.load('client')

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

    // Only non-members can view all project members
    if (ctx.auth.user!.role?.name !== UserRole.MEMBER) {
      await project.load('members')
    }

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

  @bind()
  public async insights(_: HttpContextContract, project: Project) {
    const insights = await project.getInsights()

    return {
      ...insights,
      ...project.serialize(),
    }
  }
}
