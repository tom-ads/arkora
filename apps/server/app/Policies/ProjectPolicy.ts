import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import user from 'App/Models/user'
import project from 'App/Models/project'
import UserRole from 'App/Enum/UserRole'
import User from 'App/Models/user'

export default class ProjectPolicy extends BasePolicy {
  /* 
 	Owners and org admins can do perform all project actions.
  */
  public async before(user: User | null) {
    if (user && (user.role.name === UserRole.OWNER || user?.role.name === UserRole.ORG_ADMIN)) {
      return true
    }
  }

  /* 
 	Check auth user can view a list of projects
  */
  public async viewList(user: user) {}

  /* 
 	Check auth user can view a project 
  */
  public async view(user: user, project: project) {}

  /* 
 	Check auth user can create a project 
  */
  public async create(user: user) {
    if (user.role.name !== UserRole.MANAGER) {
      return false
    }

    return true
  }

  /* 
 	Check auth user can update a project 
  */
  public async update(user: user, project: project) {
    if (user.role.name !== UserRole.MANAGER) {
      return false
    }

    return true
  }

  /* 
 	Check auth user can delete a project 
  */
  public async delete(user: user, project: project) {}
}
