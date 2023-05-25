import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type TableBodyProps = {
  className?: string
  children: ReactNode
}

export const TableBody = ({ className, children }: TableBodyProps): JSX.Element => {
  return <tbody className={twMerge('divide-y divide-gray-20', className)}>{children}</tbody>
}
