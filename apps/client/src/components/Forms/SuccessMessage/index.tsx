import classNames from 'classnames'
import { ReactNode } from 'react'

type FormSuccessMessageProps = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const FormSuccessMessage = ({
  size = 'md',
  className,
  children,
}: FormSuccessMessageProps): JSX.Element => {
  return (
    <p
      className={classNames('text-green-90 font-medium transition', {
        'text-sm h-5 mt-2': size === 'sm' || size === 'md',
        'text-base mt-3': size === 'lg',
        className,
      })}
    >
      {children}
    </p>
  )
}

export default FormSuccessMessage
