import { ReactNode } from 'react'

type PageContentProps = {
  children: ReactNode
}

export const PageContent = ({ children }: PageContentProps): JSX.Element => {
  return <div className="py-7">{children}</div>
}
