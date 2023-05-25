import { Organisation, User } from '@/types'
import TimeEntry from '@/types/models/TimeEntry'

export type Auth = {
  user: User
  organisation: Organisation
  timer: TimeEntry
}
