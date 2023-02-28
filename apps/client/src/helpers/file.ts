import { read, utils } from 'xlsx'

export async function parseCSV(file: File, header?: 'A' | number | string[]) {
  const buffer = await file.arrayBuffer()
  const workbook = read(buffer)
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const json = utils.sheet_to_json(worksheet, { header: header ?? 1 })

  return json
}
