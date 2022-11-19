import { ReactNode } from 'react'
import classNames from 'classnames'

type BadgeProps = {
  variant?: 'success' | 'danger' | 'warn' | 'default'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export const Badge = ({ variant = 'warn', size = 'sm', children }: BadgeProps): JSX.Element => {
  return (
    <div
      className={classNames('rounded font-medium flex items-center w-min select-none', {
        'px-2 py-1 text-xs': size === 'sm',
        'px-3 py-1 text-sm': size === 'md',
        'px-3 py-[0.375rem] text-base': size === 'lg',

        'bg-green-10 text-green-60': variant === 'success',
        'bg-red-10 text-red-60': variant === 'danger',
        'bg-yellow-10 text-yellow-60': variant === 'warn',
        'bg-gray-10 text-gray-70': variant === 'default',
      })}
    >
      <div
        className={classNames('rounded-full w-[7px] h-[7px] mr-4 flex-shrink-0', {
          'bg-green-60': variant === 'success',
          'bg-red-60': variant === 'danger',
          'bg-yellow-60': variant === 'warn',
          'bg-gray-60': variant === 'default',
        })}
      ></div>
      <span>{children}</span>
    </div>
  )
}
