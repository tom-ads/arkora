import classNames from 'classnames'
import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

type TabItemProps = {
  to: string
  children: ReactNode
}

export const TabItem = ({ to, children }: TabItemProps): JSX.Element => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        classNames(
          'font-medium text-sm transition-colors outline-none mx-1 border-b-2 mt-auto pb-[14px]',
          {
            'bg-white text-gray-100 border-transparent hover:bg-gray-10 focus-visible:bg-gray-10':
              !isActive,
            ' text-purple-90 border-purple-90': isActive,
          },
        )
      }
    >
      <span>{children}</span>
    </NavLink>
  )
}
