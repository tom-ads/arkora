import { convertToPounds } from '../../../helpers/currency'

test('can convert 10000 pennies into 100 pounds', () => {
  const result = convertToPounds(10000)
  expect(result).toEqual(100)
})

test('can handle null value, returns zero', () => {
  const result = convertToPounds(null as unknown as number)
  expect(result).toEqual(0)
})
