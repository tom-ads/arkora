import classNames from 'classnames'
import { ReactNode } from 'react'

type TableHeadingProps = {
  className?: string
  children?: ReactNode
}

export const TableHeading = ({ className, children }: TableHeadingProps): JSX.Element => {
  return (
    <th
      className={classNames(
        'uppercase text-xs font-semibold text-gray-70 py-3 px-4 text-left',
        className,
      )}
    >
      {children}
    </th>
  )
}
