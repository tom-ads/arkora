import { ReactNode } from 'react'

type TableRowProps = {
  children: ReactNode
}

export const TableRow = ({ children }: TableRowProps): JSX.Element => {
  return <tr>{children}</tr>
}
