import { read, utils } from 'xlsx'

export async function parseCSV(file: File, header?: 'A' | number | string[]) {
  const buffer = await file.arrayBuffer()
  const workbook = read(buffer)
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const json = utils.sheet_to_json(worksheet, { header: header ?? 1 })

  return json
}

/* 
  codes 65 - 90
*/
export function getColumnLetters(n: number): string[] {
  const letters = []
  let dividend = n
  let modulo

  while (dividend > 0) {
    modulo = (dividend - 1) % 26
    letters.unshift(String.fromCharCode(65 + modulo))
    dividend = Math.floor((dividend - modulo) / 26)
  }

  return letters
}
