import classNames from 'classnames'
import { ReactNode } from 'react'

type TableBodyProps = {
  className?: string
  children: ReactNode
}

export const TableBody = ({ className, children }: TableBodyProps): JSX.Element => {
  return <tbody className={classNames('divide-y divide-gray-20', className)}>{children}</tbody>
}
