import { cva, VariantProps } from 'class-variance-authority'
import { InputHTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'

export const input = cva(
  'border w-full rounded placeholder:text-gray-60 text-gray-80 font-normal transition-all outline-none appearance-none',
  {
    variants: {
      size: {
        xs: 'px-3 py-[7px] text-sm focus:shadow-sm',
        sm: 'px-3 py-[9px] text-base focus:shadow-sm',
        md: 'px-3 py-[10px] text-lg focus:shadow-md',
        lg: 'px-[14px] py-[11px] text-xl focus:shadow-lg',
      },
      error: {
        true: 'border-red-90 focus:shadow-md focus:shadow-red-90',
        false: 'border-gray-40 focus:shadow-purple-70 focus:border-purple-90',
      },
      disabled: {
        true: '',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  },
)

export interface FormInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'disabled' | 'size'>,
    VariantProps<typeof input> {
  name: string // prevent name from being optional
  placeHolder: string
}

export const FormInput = ({ name, placeHolder, size, error }: FormInputProps) => {
  const { register } = useFormContext()

  return (
    <input
      id={name}
      placeholder={placeHolder}
      type="text"
      className={input({ size, error })}
      {...register(name)}
    />
  )
}
