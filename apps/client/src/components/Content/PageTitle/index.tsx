import { ReactNode } from 'react'

type PageTitleProps = {
  children: ReactNode
}

export const PageTitle = ({ children }: PageTitleProps): JSX.Element => {
  return <h1 className="text-white font-semibold text-4xl mb-2">{children}</h1>
}
