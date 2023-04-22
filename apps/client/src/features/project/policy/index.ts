import UserRole from '@/enums/UserRole'
import { User } from '@/types'

export const projectPolicy = {
  'project:create': (user: User) => {
    if (user.role.name === UserRole.MEMBER) {
      return false
    }
    return true
  },
  'project:update': (user: User) => {
    if (user.role.name === UserRole.MEMBER) {
      return false
    }
    return true
  },
  'project:delete': (user: User) => {
    if ([UserRole.MEMBER, UserRole.MANAGER].includes(user.role.name)) {
      return false
    }
    return true
  },
}
