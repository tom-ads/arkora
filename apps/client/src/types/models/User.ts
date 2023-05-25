import UserRole from '@/enums/UserRole'

type User = {
  id: number
  firstname: string
  lastname: string
  email: string
  verifiedAt: string | null
  initials: string
  role: {
    name: UserRole
  }
  lastActiveAt: string

  spentDuration: number
  billableDuration: number
  unbillableDuration: number
}

export type { User }
