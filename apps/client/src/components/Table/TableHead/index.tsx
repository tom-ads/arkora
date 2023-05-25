import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type TableHeadProps = {
  className?: string
  children: ReactNode
}

export const TableHead = ({ className, children }: TableHeadProps): JSX.Element => {
  return <thead className={twMerge('bg-gray-20', className)}>{children}</thead>
}
