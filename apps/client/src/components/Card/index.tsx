import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type CardProps = {
  className?: string
  children: ReactNode
}

export const Card = ({ className, children }: CardProps): JSX.Element => {
  return <div className={twMerge('bg-white rounded shadow-glow p-6', className)}>{children}</div>
}
