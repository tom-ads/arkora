import { DateTime } from 'luxon'

export function getTimerDifference(lastStartedAt: DateTime): number {
  const diffInMinutes = lastStartedAt.diffNow('minutes').get('minutes')
  const roundedMinutes = Math.floor(Math.abs(diffInMinutes))

  return roundedMinutes
}
