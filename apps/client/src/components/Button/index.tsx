import classNames from 'classnames'
import { forwardRef, HTMLAttributes } from 'react'
import { Spinner } from '../Spinner'
import { cva, VariantProps } from 'class-variance-authority'

const button = cva(
  'relative border rounded transition-all duration-100 outline-none font-semibold flex items-center justify-center my-auto min-h-[39px]',
  {
    variants: {
      variant: {
        primary:
          'bg-purple-90 border-purple-90 hover:bg-purple-80 hover:border-purple-80 active:bg-purple-90 active:shadow-purple-90 focus:shadow-purple-90 focus-visible:bg-purple-80 focus-visible:border-purple-80 text-white',
        secondary:
          'bg-purple-80 border-purple-80 hover:bg-purple-70 hover:border-purple-70 active:bg-purple-80 active:border-purple-80 active:shadow-purple-80 focus:shadow-purple-70 focus-visible:bg-purple-70 focus-visible:border-purple-70 text-white',
        outlined:
          'border-purple-90 text-purple-90 bg-none hover:border-purple-80 hover:text-purple-80 focus:border-purple-80 focus:text-purple-80 active:shadow-purple-80 active:text-purple-90 active:border-purple-90',
        blank:
          'text-purple-90 hover:text-purple-80 focus:text-purple-90 focus-visible:text-purple-80 border-none focus:!shadow-none active:shadow-none !p-0',
      },
      size: {
        xs: 'py-[0.625rem] px-6 leading-[1.0625rem] active:shadow-sm',
        sm: 'py-[0.625rem] px-6 active:shadow-sm',
        md: 'py-3 px-9 active:shadow-md',
        lg: 'py-3 px-[2.625rem] active:shadow-lg',
      },
      danger: { true: '' },
      disabled: {
        true: 'disabled:opacity-70 pointer-events-none cursor-not-allowed select-none',
      },
      block: {
        true: 'w-full',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        danger: true,
        className:
          'bg-red-90 border-red-90 hover:bg-red-60 hover:border-red-60 active:shadow-red-90 active:bg-red-90 active:border-red-90 focus:border-red-60 focus:bg-red-60 focus-visible:border-red-60 focus-visible:bg-red-60',
      },
      {
        variant: 'secondary',
        danger: true,
        className:
          'bg-red-40 border-red-40 hover:bg-red-60 hover:border-red-60 active:shadow-red-40 active:bg-red-40 active:border-red-40 focus:border-red-40 focus:bg-red-40 focus-visible:border-red-40 focus-visible:bg-red-60',
      },
      {
        variant: 'outlined',
        danger: true,
        className:
          'border-red-90 text-red-90 hover:border-red-60 hover:text-red-60 active:border-red-90 active:text-red-90 active:shadow-red-90 focus:border-red-60 focus:text-red-60 focus-visible:border-red-60 focus-visible:text-red-60',
      },
      {
        variant: 'blank',
        danger: true,
        className:
          'text-red-90 hover:text-red-60 active:text-red-90 focus:text-red-60 focus-visible:text-red-60 shadow-none',
      },
    ],
    defaultVariants: {
      size: 'md',
      variant: 'primary',
      disabled: false,
    },
  },
)

interface ButtonProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'disabled' | 'type'>,
    VariantProps<typeof button> {
  loading?: boolean
  disabled?: boolean
  danger?: boolean
  type?: 'button' | 'submit'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, type = 'button', loading, danger, ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={classNames(button({ danger, ...props }), className)}
    >
      <Spinner
        className={classNames('w-4 h-4 text-white absolute grid place-content-center', {
          visible: loading,
          invisible: !loading,
        })}
      />
      <div
        className={classNames({
          invisible: loading,
          'visible flex items-center flex-shrink-0 gap-x-4': !loading,
        })}
      >
        {props.children}
      </div>
    </button>
  )
})
