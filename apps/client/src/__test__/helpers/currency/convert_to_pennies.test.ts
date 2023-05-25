import { convertToPennies } from '../../../helpers/currency'

test('can convert 100 pounds into 10000 pennies', () => {
  const result = convertToPennies(100)
  expect(result).toEqual(10000)
})

test('can handle null value, returns zero', () => {
  const result = convertToPennies(null as unknown as number)
  expect(result).toEqual(0)
})
