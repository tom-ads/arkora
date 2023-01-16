import TimeEntry from '@/types/TimeEntry'

type TimesheetDay = {
  day: string
  totalMinutes: number
  entries: TimeEntry[]
}

type GetTimesheetResponse = {
  totalMinutes: string
  days: TimesheetDay[]
}

export default GetTimesheetResponse
