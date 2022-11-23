import { ReactNode } from 'react'

type TableContainerProps = {
  children: ReactNode
}

export const TableContainer = ({ children }: TableContainerProps): JSX.Element => {
  return (
    <div className="p-6 bg-white rounded shadow-card">
      <div className="w-full overflow-y-hidden overflow-x-auto whitespace-nowrap scrollbar-hide rounded">
        {children}
      </div>
    </div>
  )
}
