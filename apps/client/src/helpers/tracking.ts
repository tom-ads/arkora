import { padTimeUnit } from './date'

export function timeToMinutes(time: string) {
  const splitTime = time.split(':').map(Number)
  const hours = splitTime[0] * 60
  const minutes = splitTime[1]

  return hours + minutes
}

export function minutesToTime(durationMinutes: number) {
  const minutes = durationMinutes % 60
  const hours = Math.abs(durationMinutes - minutes) / 60

  const formattedMinutes = padTimeUnit(minutes)
  const formattedHours = padTimeUnit(hours)

  return `${formattedHours}:${formattedMinutes}`
}
