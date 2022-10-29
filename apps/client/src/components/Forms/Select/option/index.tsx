import { ReactNode } from 'react'

type SelectOptionProps = {
  value: string
  children: ReactNode
}

export const SelectOption = ({ value, children }: SelectOptionProps) => {
  return <>{children}</>
}
