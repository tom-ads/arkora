import { SelectedRole } from './../../../../types'

type InviteMembersRequest = {
  members: {
    email: string
    role: SelectedRole
  }[]
}

export default InviteMembersRequest
