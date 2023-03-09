import classNames from 'classnames'
import { ReactNode } from 'react'
import { TableEmpty, TableEmptyProps } from '../TableEmpty'

type EmptyState = TableEmptyProps & {
  isEmpty: boolean
}

type TableContainerProps = {
  className?: string
  children: ReactNode
  emptyState?: EmptyState
}

export const TableContainer = ({
  className,
  emptyState,
  children,
}: TableContainerProps): JSX.Element => {
  if (emptyState?.isEmpty) {
    return <TableEmpty {...emptyState} className={className} />
  }

  return (
    <div className={classNames('p-6 bg-white rounded shadow-glow', className)}>
      <div className="w-full whitespace-nowrap scrollbar-hidden rounded overflow-x-auto">
        {children}
      </div>
    </div>
  )
}
