import classNames from 'classnames'
import { ReactNode } from 'react'

type TableHeadingProps = {
  className?: string
  children?: ReactNode
  first?: boolean
  last?: boolean
}

export const TableHeading = ({
  first,
  last,
  className,
  children,
}: TableHeadingProps): JSX.Element => {
  return (
    <th
      className={classNames(
        'uppercase text-xs font-semibold text-gray-70 py-3 px-4 text-left',
        {
          'rounded-l-[4px]': first,
          'rounded-r-[4px]': last,
        },
        className,
      )}
    >
      {children}
    </th>
  )
}
