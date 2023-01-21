import UserRole from '@/enums/UserRole'

type User = {
  id: number
  firstname: string
  lastname: string
  email: string
  initials: string
  role: {
    name: UserRole
  }
}

export type { User }
