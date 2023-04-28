import { User } from './User'

export type BudgetNote = {
  id: number
  note: string
  createdAt: string
  user: User
}
