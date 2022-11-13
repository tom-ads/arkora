import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProjectController {
  public async index(ctx: HttpContextContract) {
    const projects = await ctx.organisation?.related('projects').query()
    return {
      projects: projects?.map((p) => p.serialize()),
    }
  }
}