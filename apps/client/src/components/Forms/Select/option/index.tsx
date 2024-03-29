import { ReactNode } from 'react'

type SelectOptionProps = {
  id?: string | number
  value?: string
  children: ReactNode
}

export const SelectOption = ({ value, children }: SelectOptionProps) => {
  return <>{children}</>
}
