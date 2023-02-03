import classNames from 'classnames'
import { ReactNode } from 'react'

type PageHeaderProps = {
  className?: string
  children: ReactNode
}

export const PageHeader = ({ className, children }: PageHeaderProps) => {
  return (
    <div className={classNames('flex justify-between items-center gap-x-4', className)}>
      {children}
    </div>
  )
}
