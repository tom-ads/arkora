import { formatMinutesToTime } from '../../../helpers/date'

test('returns padded time, when less than an hour', () => {
  const result = formatMinutesToTime(30)
  expect(result).toEqual('00:30')
})

test('returns 01:00, when passed 60 minutes', () => {
  const result = formatMinutesToTime(60)
  expect(result).toEqual('01:00')
})

test('returns 24:00, when passed 1440 minutes', () => {
  const result = formatMinutesToTime(1440) // 24hrs
  expect(result).toEqual('24:00')
})

test('returns padded time 00:00, when passed 0 minutes', () => {
  const result = formatMinutesToTime(0)
  expect(result).toEqual('00:00')
})

test('returns 00:00, when passed an invalid duration', () => {
  const result = formatMinutesToTime(null as unknown as number)
  expect(result).toEqual('00:00')
})
