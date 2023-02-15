import { cva, VariantProps } from 'class-variance-authority'
import { HTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'

export const inputStyling = cva(
  'border w-full rounded placeholder:text-gray-60 text-gray-80 font-normal transition-all outline-none appearance-none disabled:bg-gray-20',
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
      error: false,
      disabled: false,
    },
  },
)

export interface FormInputBaseProps
  extends HTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputStyling> {
  disabled?: boolean
  placeHolder?: string
}

export interface FormInputProps extends FormInputBaseProps {
  name: string // prevent name from being optional
}

export const FormInput = ({ name, placeHolder, size, error, ...props }: FormInputProps) => {
  const { register } = useFormContext()

  return (
    <input
      {...props}
      {...register(name)}
      id={name}
      placeholder={placeHolder}
      type="text"
      className={inputStyling({ size, error })}
    />
  )
}
