import classNames from 'classnames'
import { UseFormRegisterReturn } from 'react-hook-form'

type FormInputProps = {
  id: string
  placeHolder?: string
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  register: Partial<UseFormRegisterReturn>
}

export const FormInput = ({ id, placeHolder, size = 'sm', error, register }: FormInputProps) => {
  return (
    <input
      id={id}
      type="text"
      {...register}
      placeholder={placeHolder}
      className={classNames(
        'border border-gray-40 w-full rounded placeholder:text-green-60 font-normal text-gray-80 transition-all outline-none',
        {
          'px-3 py-2 text-sm focus:shadow-sm': size === 'sm',
          'px-3 py-3 text-base focus:shadow-md': size === 'md',
          'px-[0.875rem] py-[10px] text-xl focus:shadow-lg': size === 'lg',

          'focus:shadow-purple-90 focus:border-purple-70': !error,
          'border-red-90 focus:shadow-md focus:shadow-red-90': error,
        },
      )}
    />
  )
}
