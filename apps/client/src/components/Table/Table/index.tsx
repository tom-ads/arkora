import { ReactNode } from 'react'

type TableProps = {
  children: ReactNode
}

export const Table = ({ children }: TableProps): JSX.Element => {
  return <table className="w-full table-fixed">{children}</table>
}
