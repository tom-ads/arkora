import { isValidNumber } from '../../../helpers/currency'

test('returns false, when value is null', () => {
  const result = isValidNumber(null as unknown as number)
  expect(result).toEqual(false)
})

test('returns false, when value is undefined', () => {
  const result = isValidNumber(null as unknown as number)
  expect(result).toEqual(false)
})

test('returns false, when value is NaN', () => {
  const result = isValidNumber(NaN as unknown as number)
  expect(result).toEqual(false)
})

test('returns false, when value is not a number', () => {
  const result = isValidNumber('test' as unknown as number)
  expect(result).toEqual(false)
})

test('returns true, when value is a positive number', () => {
  const result = isValidNumber(100)
  expect(result).toEqual(true)
})
