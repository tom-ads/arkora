import { Organisation, User } from '@/types'
import TimeEntry from '@/types/TimeEntry'

export type Auth = {
  user: User
  organisation: Organisation
  timer: TimeEntry
}
