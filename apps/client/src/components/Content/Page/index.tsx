import { ReactNode } from 'react'

type PageProps = {
  children: ReactNode
}

export const Page = ({ children }: PageProps): JSX.Element => {
  return (
    <>
      <div className="bg-purple-90 inset-x-0 h-48 absolute z-0"></div>
      <div className="relative py-9">{children}</div>
    </>
  )
}
