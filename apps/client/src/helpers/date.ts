import { DateTime, Interval } from 'luxon'

/* credit to thread for solution: https://github.com/moment/luxon/issues/118 */
function getOrdinalSuffix(n: number) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100

  return s[(v - 20) % 10] || s[v] || s[0]
}

/* 
  Uses a positive lookbehind to find the day in a string
  matched with a space infront. The ordinal suffix is then
  added onto the end of the day.

  Caveats: Assuming day is always infront of string, and not year. 
*/
export function addOrdinalSuffix(date: DateTime, format: string) {
  const monthDay = date.toLocal().day
  const formattedDate = date.toFormat(format)

  return formattedDate.replace(/(?<=\d)\s/, getOrdinalSuffix(monthDay))
}

export function getDatesBetweenPeriod(startDate: DateTime, endDate: DateTime) {
  return Interval.fromDateTimes(startDate, endDate.plus(1))
    .splitBy({ day: 1 })
    .map((d) => d.start)
}

export function formatMinutesToTime(durationMinutes: number) {
  const minutes = durationMinutes % 60
  const hours = Math.abs(durationMinutes - minutes) / 60

  const formattedMinutes = padTimeUnit(minutes)
  const formattedHours = padTimeUnit(hours)

  return `${formattedHours}:${formattedMinutes}`
}

export function formatMinutesToHourMinutes(durationMinutes: number) {
  const minutes = durationMinutes % 60
  const hours = Math.abs(durationMinutes - minutes) / 60

  const formattedHours = padTimeUnit(hours)
  const formattedMinutes = padTimeUnit(minutes)

  return `${formattedHours}h ${formattedMinutes}m`
}

export function convertTimeToMinutes(time: string) {
  const splitTime = time.split(':').map(Number)
  const hours = splitTime[0] * 60
  const minutes = splitTime[1]

  return hours + minutes
}

export function convertMinutesToHours(minutes: number) {
  return minutes / 60
}

export function padTimeUnit(value: number) {
  return value < 10 ? `0${value}` : value
}
