import classNames from 'classnames'
import { ReactNode } from 'react'

export type TabGroupProps = {
  className?: string
  children: ReactNode
}

export const TabGroup = ({ className, children }: TabGroupProps): JSX.Element => {
  return <div className={classNames('flex', className)}>{children}</div>
}
