import { FormEventHandler, MouseEventHandler, ReactNode } from 'react'
import classNames from 'classnames'
import { forwardRef } from 'react'
import { Spinner } from '../Spinner'

type ButtonProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'outlined' | 'blank'
  danger?: boolean
  type?: 'button' | 'submit'
  block?: boolean
  className?: string
  isLoading?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  onSubmit?: FormEventHandler<HTMLButtonElement>
  children: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    size = 'md',
    onSubmit,
    isLoading,
    className,
    onClick,
    variant = 'primary',
    danger = false,
    type = 'button',
    block = false,
    children,
  } = props

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      onSubmit={onSubmit}
      disabled={isLoading}
      className={classNames(
        'relative border rounded transition-all outline-none font-semibold flex items-center justify-center my-auto min-h-[39px]',
        {
          'w-full': block,

          'py-[0.625rem] px-6 leading-[1.0625rem]': size === 'xs',
          'py-[0.625rem] px-6 active:shadow-sm': size === 'sm',
          'py-3 px-9 active:shadow-md': size === 'md',
          'py-3 px-[2.625rem] active:shadow-lg': size === 'lg',

          'bg-purple-90 border-purple-90 hover:bg-purple-80 hover:border-purple-80 active:bg-purple-90 active:shadow-purple-90 focus:shadow-purple-90 focus-visible:bg-purple-80 focus-visible:border-purple-80 text-white':
            variant === 'primary',
          'bg-purple-80 border-purple-80 hover:bg-purple-70 hover:border-purple-70 active:bg-purple-80 active:border-purple-80 active:shadow-purple-80 focus:shadow-purple-70 focus-visible:bg-purple-70 focus-visible:border-purple-70 text-white':
            variant === 'secondary',
          'border-purple-90 !text-purple-90 hover:border-purple-80 hover:!text-purple-80 active:shadow-purple-90 focus:shadow-purple-90 bg-none':
            variant === 'outlined',
          'text-purple-90 hover:text-purple-80 focus:text-purple-90 focus-visible:text-purple-80 border-none focus:!shadow-none !p-0':
            variant === 'blank',

          'bg-red-90': danger && variant === 'primary',
        },
        className,
      )}
    >
      <Spinner
        className={classNames('w-4 h-4 text-white absolute grid place-content-center', {
          visable: isLoading,
          invisible: !isLoading,
        })}
      />
      <div className={classNames({ invisible: isLoading, visable: !isLoading })}>{children}</div>
    </button>
  )
})
