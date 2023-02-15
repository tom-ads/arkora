import TimeEntry from './TimeEntry'
import { User } from './User'

export type Timer = User & { timer?: TimeEntry }
