import { calculatePercentage } from '../../../helpers/currency'

/*
    Improvement: function should just return the raw value, and make caller use .toFixed
*/

test('returns 0 percent, when total is 100 and value is 0 to two decimal places', () => {
  const result = calculatePercentage(0, 100)
  expect(result).toEqual(0)
})

test('returns 25 percent, when total is 100 and value is 25 to two decimal places', () => {
  const result = calculatePercentage(25, 100)
  expect(result).toEqual('25.00')
})

test('returns 50 percent, when total is 100 and value is 50 to two decimal places', () => {
  const result = calculatePercentage(50, 100)
  expect(result).toEqual('50.00')
})

test('returns 100 percent, when total is 100 and value is 100 to two decimal places', () => {
  const result = calculatePercentage(100, 100)
  expect(result).toEqual('100.00')
})

test('returns 150 percent, when total is 100 and value is 150 to two decimal places', () => {
  const result = calculatePercentage(150, 100)
  expect(result).toEqual('150.00')
})

test('returns 0 percent, when total is null and value is 100 to two decimal places', () => {
  const result = calculatePercentage(100, null as unknown as number)
  expect(result).toEqual(0)
})

test('returns 0 percent, when total is 100 and value is null to two decimal places', () => {
  const result = calculatePercentage(null as unknown as number, 100)
  expect(result).toEqual(0)
})
