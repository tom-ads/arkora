import classNames from 'classnames'
import { ReactNode } from 'react'

type TableHeadProps = {
  className?: string
  children: ReactNode
}

export const TableHead = ({ className, children }: TableHeadProps): JSX.Element => {
  return <thead className={classNames('bg-gray-20', className)}>{children}</thead>
}
