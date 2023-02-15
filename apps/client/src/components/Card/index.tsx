import classNames from 'classnames'
import { ReactNode } from 'react'

type CardProps = {
  className?: string
  children: ReactNode
}

export const Card = ({ className, children }: CardProps): JSX.Element => {
  return <div className={classNames('bg-white rounded shadow-glow p-6', className)}>{children}</div>
}
