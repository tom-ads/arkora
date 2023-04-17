import { DateTime } from 'luxon'
import { getDatesBetweenPeriod } from '../../../helpers/date'

test('returns dates from 2023-04-01 to 2023-04-07', () => {
  const startDate = DateTime.now().set({ month: 4, day: 1, millisecond: 0 })
  const endDate = DateTime.now().set({ month: 4, day: 7, millisecond: 0 })

  const result = getDatesBetweenPeriod(startDate, endDate)

  expect(result[0]).toEqual(startDate)
  expect(result[1]).toEqual(startDate.plus({ days: 1 }))
  expect(result[2]).toEqual(startDate.plus({ days: 2 }))
  expect(result[3]).toEqual(startDate.plus({ days: 3 }))
  expect(result[4]).toEqual(startDate.plus({ days: 4 }))
  expect(result[5]).toEqual(startDate.plus({ days: 5 }))
  expect(result[6]).toEqual(endDate)
})
