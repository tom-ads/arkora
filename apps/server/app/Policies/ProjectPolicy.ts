import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import UserRole from 'App/Enum/UserRole'
import Project from 'App/Models/Project'

export default class ProjectPolicy extends BasePolicy {
  /* 
 	  Check auth user can view an organisations project 
  */
  public async view(user: User, project: Project) {
    await project.load('client')

    if (project.client.organisationId !== user.organisationId) {
      return false
    }

    if (user.role?.name === UserRole.MEMBER) {
      return false
    }

    return true
  }

  /* 
 	  Check auth user can create an organisations project 
  */
  public async create(user: User) {
    if (user.role.name === UserRole.MEMBER) {
      return false
    }

    return true
  }

  /*
 	  Check auth user can delete an organisations project 
  */
  public async delete(user: User, project: Project) {
    await project.load('client')

    if (project.client.organisationId !== user.organisationId) {
      return false
    }

    if (user.role.name === UserRole.MEMBER) {
      return false
    }

    return true
  }
}
