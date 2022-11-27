import { cva, VariantProps } from 'class-variance-authority'
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

export const FormLabel = ({ htmlFor, size = 'sm', children }: FormInputProps): JSX.Element => {
  return (
    <label className={label({ size })} htmlFor={htmlFor}>
      {children}
    </label>
  )
}
