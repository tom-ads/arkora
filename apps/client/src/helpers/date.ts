import { DateTime } from 'luxon'

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
