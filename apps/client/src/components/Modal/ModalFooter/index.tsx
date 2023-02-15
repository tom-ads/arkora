import classNames from 'classnames'
import { ReactNode } from 'react'

type ModalFooterProps = {
  className?: string
  children: ReactNode
}

export const ModalFooter = ({ className, children }: ModalFooterProps): JSX.Element => {
  return (
    <div className={classNames('w-full flex justify-between items-center gap-x-2 mt-6', className)}>
      {children}
    </div>
  )
}
