import classNames from 'classnames'
import { ReactNode } from 'react'

type FormErrorMessageProps = {
  isVisible: boolean
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const FormErrorMessage = ({
  isVisible,
  size = 'md',
  children,
}: FormErrorMessageProps): JSX.Element => {
  return (
    <p
      className={classNames('text-red-90 font-medium transition', {
        'text-sm h-5': size === 'sm' || size === 'md',
        'text-base': size === 'lg',
      })}
    >
      {isVisible && children}
    </p>
  )
}

export default FormErrorMessage
