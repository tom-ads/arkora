import { formatMinutesToHourMinutes } from '../../../helpers/date'

test('returns padded time, when less than an hour', () => {
  const result = formatMinutesToHourMinutes(30)
  expect(result).toEqual('00:30')
})
