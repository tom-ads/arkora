export function convertToPennies(value: number) {
  if (!value) return 0
  return value * 100
}

export function convertToPounds(value: number) {
  if (!value) return 0
  return value / 100
}
