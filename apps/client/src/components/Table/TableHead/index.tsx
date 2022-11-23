import { ReactNode } from 'react'

type TableHeadProps = {
  children: ReactNode
}

export const TableHead = ({ children }: TableHeadProps): JSX.Element => {
  return <thead className="bg-gray-20">{children}</thead>
}
