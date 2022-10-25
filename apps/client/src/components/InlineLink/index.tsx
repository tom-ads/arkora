import { Link } from 'react-router-dom'
import { ReactNode } from 'react'
import classNames from 'classnames'

type InlineLinkProps = {
  to: string
  className?: string
  children: ReactNode
}

export const InlineLink = ({ to, className, children }: InlineLinkProps): JSX.Element => {
  return (
    <Link
      className={classNames(
        'text-purple-90 inline-block hover:text-purple-80 hover:underline outline-none focus:underline',
        className,
      )}
      to={to}
    >
      {children}
    </Link>
  )
}
