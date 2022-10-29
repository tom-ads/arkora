import classNames from 'classnames'
import { ReactNode } from 'react'

type FormControlProps = {
  className?: string
  children: ReactNode
}

export const FormControl = ({ className, children }: FormControlProps): JSX.Element => {
  return <div className={classNames('relative flex flex-col w-full', className)}>{children}</div>
}
