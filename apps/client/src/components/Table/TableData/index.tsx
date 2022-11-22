import classNames from 'classnames'
import { ReactNode } from 'react'

type TableDataProps = {
  colSpan?: number
  className?: string
  children: ReactNode
}

export const TableData = ({ colSpan, className, children }: TableDataProps): JSX.Element => {
  return (
    <td className={classNames('p-4 text-sm text-gray-80', className)} colSpan={colSpan}>
      {children}
    </td>
  )
}
