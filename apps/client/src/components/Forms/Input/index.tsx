import classNames from 'classnames'
import { forwardRef } from 'react'

type FormInputProps = {
  placeHolder?: string
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput(
  props,
  ref,
) {
  const { placeHolder, size = 'sm', error } = props

  return (
    <input
      ref={ref}
      type="text"
      placeholder={placeHolder}
      className={classNames(
        'border border-gray-40 w-full rounded placeholder:text-green-60 bg-gray-20 font-normal text-gray-80 transition-all outline-none',
        {
          'px-3 py-1 text-sm focus:shadow-sm': size === 'sm',
          'px-3 py-3 text-base focus:shadow-md': size === 'md',
          'px-[0.875rem] py-[10px] text-xl focus:shadow-lg': size === 'lg',

          'focus:shadow-purple-90 focus:border-purple-70': !error,
          'border-red-90 focus:shadow-md focus:shadow-red-90': error,
        },
      )}
    />
  )
})
