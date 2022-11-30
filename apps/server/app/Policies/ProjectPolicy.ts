import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import UserRole from 'App/Enum/UserRole'

export default class ProjectPolicy extends BasePolicy {
  /* 
 	  Owners and org admins can do perform all project actions.
  */
  public async before(user: User | null) {
    if (
      user?.id &&
      (user.role?.name === UserRole.OWNER || user?.role?.name === UserRole.ORG_ADMIN)
    ) {
      return true
    }
  }

  /*
 	  Check auth user can view a list of projects
  */
  // public async viewList(user: User) {}

  /* 
 	Check auth user can view a project 
  */
  public async view(user: User) {
    if (user.role?.name === UserRole.MEMBER) {
      return false
    }

    return true
  }

  /* 
 	  Check auth user can create a project 
  */
  public async create(user: User) {
    if (user.role.name === UserRole.MEMBER) {
      return false
    }

    return true
  }

  /* 
 	  Check auth user can update a project 
  */
  // public async update(user: User, project: project) {
  //   if (user.role.name !== UserRole.MANAGER) {
  //     return false
  //   }

  //   return true
  // }

  /* 
 	  Check auth user can delete a project 
  */
  // public async delete(user: User, project: project) {}
}
