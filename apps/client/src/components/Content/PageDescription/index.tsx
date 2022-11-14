import { ReactNode } from 'react'

type PageDescriptionProps = {
  children: ReactNode
}

export const PageDescription = ({ children }: PageDescriptionProps): JSX.Element => {
  return <p className="text-base text-white mb-2">{children}</p>
}
