import { User } from '@/types'
import TimeEntry from '@/types/TimeEntry'

type GetTimersResponse = User & { timer?: TimeEntry }

export default GetTimersResponse
