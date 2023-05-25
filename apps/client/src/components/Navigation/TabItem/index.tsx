import { cva } from 'class-variance-authority'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

const tabStyling = cva('font-medium transition-all outline-none mx-1 border-b-2 mt-auto', {
  variants: {
    size: {
      xs: 'pb-[14px] text-sm',
      sm: 'pb-4 text-base',
      md: 'pb-[18px] text-base',
    },
    active: {
      true: 'text-purple-90 border-purple-90',
      false: 'bg-white text-gray-80 border-transparent',
    },
  },
  defaultVariants: {
    size: 'xs',
    active: false,
  },
})

interface BaseNavItemProps {
  size?: 'xs' | 'sm' | 'md'
  className?: string
  children: ReactNode
}

interface TabNavItemProps extends BaseNavItemProps {
  to: string
}

export const TabNavItem = ({ to, size, className, children }: TabNavItemProps): JSX.Element => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => classNames(tabStyling({ active: isActive, size }), className)}
    >
      <span>{children}</span>
    </NavLink>
  )
}

interface TabItemProps extends BaseNavItemProps {
  onClick: () => void
  isActive: boolean
}

export const TabItem = ({
  onClick,
  isActive,
  size,
  className,
  children,
}: TabItemProps): JSX.Element => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(tabStyling({ active: isActive, size }), className)}
    >
      <span>{children}</span>
    </button>
  )
}
