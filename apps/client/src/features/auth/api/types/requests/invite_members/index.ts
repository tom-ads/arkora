import UserRole from '@/enums/UserRole'

type InviteMembersRequest = {
  members: {
    email: string
    role: Omit<UserRole, 'Owner'>
  }[]
}

export default InviteMembersRequest
