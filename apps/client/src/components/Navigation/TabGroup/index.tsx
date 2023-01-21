import classNames from 'classnames'
import { ReactNode } from 'react'

export type TabGroupProps = {
  className?: string
  children: ReactNode
}

export const TabGroup = ({ className, children }: TabGroupProps): JSX.Element => {
  return <div className={classNames('flex gap-x-9', className)}>{children}</div>
}
