import UserRole from '@/enums/UserRole'

type UpdateAccountRequest = {
  id: number
  firstname: string
  lastname: string
  role: UserRole
}

export default UpdateAccountRequest
