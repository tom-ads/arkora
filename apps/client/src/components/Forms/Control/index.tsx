import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type FormControlProps = {
  className?: string
  children: ReactNode
}

export const FormControl = ({ className, children }: FormControlProps): JSX.Element => {
  return <div className={twMerge('relative flex flex-col w-full', className)}>{children}</div>
}
