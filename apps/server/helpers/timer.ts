import { DateTime } from 'luxon'

export function timerDifference(lastStartedAt: DateTime) {
  const diffInMinutes = lastStartedAt.diffNow('minutes').get('minutes')
  const roundedMinutes = Math.floor(Math.abs(diffInMinutes))

  return roundedMinutes
}
