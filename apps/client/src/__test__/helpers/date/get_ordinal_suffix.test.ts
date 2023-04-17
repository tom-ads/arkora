import { getOrdinalSuffix } from '../../../helpers/date'

test('returns st, when number is 1', () => {
  const result = getOrdinalSuffix(1)
  expect(result).toEqual('st')
})

test('returns nd, when number is 2', () => {
  const result = getOrdinalSuffix(2)
  expect(result).toEqual('nd')
})

test('returns rd, when number is 3', () => {
  const result = getOrdinalSuffix(3)
  expect(result).toEqual('rd')
})

test('returns th, when number is 4', () => {
  const result = getOrdinalSuffix(4)
  expect(result).toEqual('th')
})
