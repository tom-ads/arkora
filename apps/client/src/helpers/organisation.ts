import { DateTime } from 'luxon'

export function calcDailyDuration(
  openingTime: DateTime,
  closingTime: DateTime,
  breakDuration: number,
) {
  const diffInMinutes = closingTime.diff(openingTime).as('minutes')
  return diffInMinutes - breakDuration
}
