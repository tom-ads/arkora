import TimeEntry from 'App/Models/TimeEntry'
import { DateTime } from 'luxon'

export function timerDifference(lastStartedAt: DateTime): number {
  const diffInMinutes = lastStartedAt.diffNow('minutes').get('minutes')
  const roundedMinutes = Math.floor(Math.abs(diffInMinutes))

  return roundedMinutes
}

export function getTimeEntriesTotalMinutes(entries: TimeEntry[]): number {
  if (!entries || !entries.length) {
    return 0
  }

  return entries
    .map((entry) => entry.durationMinutes)
    .reduce((prev: number, curr: number) => (prev ? (curr += prev) : curr), 0)
}

export function isEntryDurationExceeded(duration: number) {
  return duration > 1439
}
