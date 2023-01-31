import { cva, VariantProps } from 'class-variance-authority'
import classNames from 'classnames'
import { HTMLAttributes } from 'react'

const label = cva('font-medium text-gray-100 mb-2 w-max', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-base',
      md: 'text-lg',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})

interface FormInputProps extends HTMLAttributes<HTMLLabelElement>, VariantProps<typeof label> {
  htmlFor: string
}

export const FormLabel = ({
  htmlFor,
  size = 'sm',
  className,
  children,
}: FormInputProps): JSX.Element => {
  return (
    <label className={classNames(label({ size }), className)} htmlFor={htmlFor}>
      {children}
    </label>
  )
}
