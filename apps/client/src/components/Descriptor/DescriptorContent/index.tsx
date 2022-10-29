import classNames from 'classnames'
import { ReactNode } from 'react'

type DescriptorContentProps = {
  className?: string
  children: ReactNode
}

export const DescriptorContent = ({ className, children }: DescriptorContentProps): JSX.Element => {
  return <div className={classNames('space-y-4 w-full', className)}>{children}</div>
}
