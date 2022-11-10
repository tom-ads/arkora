import classNames from 'classnames'
import { ReactNode } from 'react'

type FormLabelProps = {
  htmlFor?: string
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export const FormLabel = ({ htmlFor, size = 'md', children }: FormLabelProps): JSX.Element => {
  return (
    <label
      className={classNames('font-medium text-gray-100 mb-2 w-max', {
        'text-sm': size === 'sm',
        'text-md': size === 'md',
        'text-lg': size === 'lg',
      })}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  )
}
