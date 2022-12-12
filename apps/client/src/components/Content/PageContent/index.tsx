import classNames from 'classnames'
import { ReactNode } from 'react'

type PageContentProps = {
  className?: string
  children: ReactNode
}

export const PageContent = ({ className, children }: PageContentProps): JSX.Element => {
  return <div className={classNames('py-7', className)}>{children}</div>
}
