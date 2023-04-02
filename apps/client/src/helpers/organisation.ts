import { DateTime } from 'luxon'

export function calcDailyDuration(openingTime: DateTime, closingTime: DateTime) {
  return closingTime.diff(openingTime).as('minutes')
}
