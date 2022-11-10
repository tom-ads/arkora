import classNames from 'classnames'
import { ReactNode } from 'react'

type DescriptorProps = {
  className?: string
  children: ReactNode
}

export const Descriptor = ({ className, children }: DescriptorProps): JSX.Element => {
  return (
    <div
      className={classNames(
        'flex justify-between gap-4 md:gap-8 pt-4 pb-6 flex-wrap md:flex-nowrap',
        className,
      )}
    >
      {children}
    </div>
  )
}
