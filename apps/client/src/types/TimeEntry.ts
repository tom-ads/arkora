import { DateTime } from 'luxon'

type TimeEntry = {
  id: number
  date: DateTime
  durationMinutes: number
  estimatedMinutes: number
  description: string
  lastStartedAt: DateTime
  lastStoppedAt: DateTime
}

export default TimeEntry
