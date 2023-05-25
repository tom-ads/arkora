import { ReactNode } from 'react'

type TableProps = {
  children: ReactNode
}

export const Table = ({ children }: TableProps): JSX.Element => {
  return <table className="min-w-full">{children}</table>
}
