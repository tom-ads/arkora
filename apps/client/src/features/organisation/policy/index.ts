import UserRole from '@/enums/UserRole'
import { User } from '@/types'

export const organisationPolicies = {
  'organisation:update': (user: User) => {
    if ([UserRole.MEMBER, UserRole.MANAGER].includes(user.role.name)) {
      return false
    }
    return true
  },
  'organisation:delete': (user: User) => {
    if (user.role.name !== UserRole.OWNER) {
      return false
    }
    return true
  },
}
