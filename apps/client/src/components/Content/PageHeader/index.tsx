import { ReactNode } from 'react'

type PageHeaderProps = {
  children: ReactNode
}

export const PageHeader = ({ children }: PageHeaderProps) => {
  return <div className="flex justify-between items-center gap-x-4">{children}</div>
}
