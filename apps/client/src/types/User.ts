import UserRole from '@/enums/UserRole'

type User = {
  firstname: string
  lastname: string
  email: string
  role: UserRole
}

export type { User }
