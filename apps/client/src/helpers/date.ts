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

export function durationToFormattedTime(duration: number) {
  const hours = Math.floor(Math.abs(duration / 60))
  const minutes = duration % 60

  return {
    displayFormat: `${hours}h ${minutes}m`,
    consumableFormat: `${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }`,
  }
}

export function getDatesBetweenPeriod(startDate: DateTime, endDate: DateTime) {
  return Interval.fromDateTimes(startDate, endDate.plus(1))
    .splitBy({ day: 1 })
    .map((d) => d.start)
}

export function formatToHours(minutes: number) {
  const totalHours = parseInt(minutes / 60, 10)
  const totalMinutes = minutes % 60

  const formattedHours = totalHours < 10 ? `0${totalHours}` : totalHours
  const formattedMinutes = totalMinutes < 10 ? `0${totalMinutes}` : totalMinutes

  return `${formattedHours}h ${formattedMinutes}m`
}

export function convertMinutesToHours(minutes: number) {
  return minutes / 60
}
