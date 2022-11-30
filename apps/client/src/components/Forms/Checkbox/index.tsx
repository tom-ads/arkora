import { cva, VariantProps } from 'class-variance-authority'
import { HTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'

const checkBox = cva(
  'checked:checkbox cursor-pointer p-1 border-gray-40 rounded border bg-white checked:bg-purple-90 checked:border-purple-90 focus:shadow-purple-70 focus:border-purple-90 focus:outline-none focus-visible:shadow-purple-70 focus-visible:border-purple-90 appearance-none transition duration-200',
  {
    variants: {
      size: {
        xs: 'h-4 w-4 focus:shadow-sm',
        sm: 'h-5 w-5 focus:shadow-sm',
        md: 'h-7 w-7 focus:shadow-md',
        lg: 'h-8 w-8 focus:shadow-lg',
      },
      error: {
        true: 'border-red-90 focus:shadow-md focus:!shadow-red-90 checked:border-red-90 checked:bg-red-90 focus-visible:border-red-90',
        false: 'focus:shadow-purple-70 focus:border-purple-90',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  },
)

interface CheckboxProps extends HTMLAttributes<HTMLInputElement>, VariantProps<typeof checkBox> {
  name: string
}

export const FormCheckbox = ({ name, size, error }: CheckboxProps): JSX.Element => {
  const { register } = useFormContext()

  return (
    <input id={name} type="checkbox" className={checkBox({ size, error })} {...register(name)} />
  )
}
