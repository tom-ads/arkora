import { ReactNode } from 'react'

type TableBodyProps = {
  children: ReactNode
}

export const TableBody = ({ children }: TableBodyProps): JSX.Element => {
  return <tbody className="divide-y divide-gray-20">{children}</tbody>
}
