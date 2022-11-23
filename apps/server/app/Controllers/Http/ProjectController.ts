import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProjectController {
  public async create(ctx: HttpContextContract) {}

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
