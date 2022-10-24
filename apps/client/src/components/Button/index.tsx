import { FormEventHandler, ReactNode, Ref } from 'react'
import classNames from 'classnames'
import { forwardRef } from 'react'

type ButtonProps = {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'outlined'
  danger?: boolean
  type?: 'button' | 'submit'
  block?: boolean
  onSubmit?: FormEventHandler<HTMLButtonElement>
  children: ReactNode
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    size = 'md',
    onSubmit,
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
      onSubmit={onSubmit}
      className={classNames(
        'border rounded transition outline-none font-semibold text-white text-center',
        {
          'w-full': block,

          'py-[0.625rem] px-6 active:shadow-sm': size === 'sm',
          'py-3 px-9 active:shadow-md': size === 'md',
          'py-3 px-[2.625rem] active:shadow-lg': size === 'lg',

          'bg-purple-90 border-purple-90 hover:bg-purple-80 hover:border-purple-80 active:bg-purple-90 active:shadow-purple-90':
            variant === 'primary',
          'bg-purple-70 border-purple-70 hover:bg-purple-80 hover:border-purple-80 active:bg-purple-70 active:border-purple-70 active:shadow-purple-70':
            variant === 'secondary',
          'border-purple-90 !text-purple-90 hover:border-purple-80 hover:!text-purple-80 active:shadow-purple-90 bg-none':
            variant === 'outlined',
        },
      )}
    >
      {children}
    </button>
  )
})
