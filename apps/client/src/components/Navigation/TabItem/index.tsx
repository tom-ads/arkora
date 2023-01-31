import { cva } from 'class-variance-authority'
import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

const tabStyling = cva(
  'font-medium text-sm transition-colors outline-none mx-1 border-b-2 mt-auto pb-[14px]',
  {
    variants: {
      active: {
        true: 'text-purple-90 border-purple-90',
        false:
          'bg-white text-gray-100 border-transparent hover:bg-gray-10 focus-visible:bg-gray-10',
      },
    },
  },
)

type TabItemProps = {
  to: string
  children: ReactNode
}

export const TabItem = ({ to, children }: TabItemProps): JSX.Element => {
  return (
    <NavLink to={to} className={({ isActive }) => tabStyling({ active: isActive })}>
      <span>{children}</span>
    </NavLink>
  )
}
