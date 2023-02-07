export function convertToPennies(value: number) {
  if (!value) return 0
  return value * 100
}

export function convertToPounds(value: number) {
  if (!value) return 0
  return value / 100
}

export function calculatePercentage(cost: number, total: number) {
  if (!isValidNumber(cost) || !isValidNumber(total)) {
    return 0
  }

  return (cost / total) * 100
}

export function isValidNumber(number: number) {
  if (!number || isNaN(number) || typeof number !== 'number') {
    return false
  }

  return true
}
