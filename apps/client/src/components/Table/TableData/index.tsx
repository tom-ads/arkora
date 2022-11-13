import { ReactNode } from 'react'

type TableDataProps = {
  children: ReactNode
}

export const TableData = ({ children }: TableDataProps): JSX.Element => {
  return <td>{children}</td>
}
