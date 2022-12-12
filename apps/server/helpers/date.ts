import { DateTime, Interval } from 'luxon'

export function getDatesBetweenPeriod(startDate: DateTime, endDate: DateTime) {
  return Interval.fromDateTimes(startDate, endDate.plus(1))
    .splitBy({ day: 1 })
    .map((d) => d.start)
}
