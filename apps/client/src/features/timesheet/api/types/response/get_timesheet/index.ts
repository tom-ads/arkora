import TimeEntry from '@/types/TimeEntry'
import { DateTime } from 'luxon'

type TimesheetDay = {
  day: DateTime
  total_minutes: number
  entries: TimeEntry[]
}

type GetTimesheetResponse = {
  total_minutes: string
  days: TimesheetDay[]
}

export default GetTimesheetResponse
