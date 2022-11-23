import { ReactNode } from 'react'

type TableRowProps = {
  children: ReactNode
}

export const TableRow = ({ children }: TableRowProps): JSX.Element => {
  return <tr className="relative transform scale-100">{children}</tr>
}
