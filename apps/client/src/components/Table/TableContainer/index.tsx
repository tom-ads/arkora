import { ReactNode } from 'react'

type TableContainerProps = {
  children: ReactNode
}

export const TableContainer = ({ children }: TableContainerProps): JSX.Element => {
  return (
    <div className="p-6 bg-white rounded shadow-glow">
      <div className="w-full whitespace-nowrap scrollbar-hidden rounded overflow-x-auto">
        {children}
      </div>
    </div>
  )
}
