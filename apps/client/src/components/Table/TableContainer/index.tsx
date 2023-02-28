import classNames from 'classnames'
import { ReactNode } from 'react'

type TableContainerProps = {
  className?: string
  children: ReactNode
}

export const TableContainer = ({ className, children }: TableContainerProps): JSX.Element => {
  return (
    <div className={classNames('p-6 bg-white rounded shadow-glow', className)}>
      <div className="w-full whitespace-nowrap scrollbar-hidden rounded overflow-x-auto">
        {children}
      </div>
    </div>
  )
}
