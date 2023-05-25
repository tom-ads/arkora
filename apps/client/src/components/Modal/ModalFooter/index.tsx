import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type ModalFooterProps = {
  className?: string
  children: ReactNode
}

export const ModalFooter = ({ className, children }: ModalFooterProps): JSX.Element => {
  return (
    <div className={twMerge('w-full flex justify-between items-center gap-x-2 mt-6', className)}>
      {children}
    </div>
  )
}
