import classNames from 'classnames'
import { ReactNode } from 'react'

type FormErrorMessageProps = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export const FormErrorMessage = ({
  size = 'md',
  className,
  children,
}: FormErrorMessageProps): JSX.Element => {
  return (
    <p
      className={classNames('text-red-90 font-medium transition', {
        'text-xs mt-2': size === 'sm' || size === 'md',
        'text-sm mt-3': size === 'lg',
        className,
      })}
    >
      {children}
    </p>
  )
}
