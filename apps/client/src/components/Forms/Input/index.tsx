import classNames from 'classnames'
import { forwardRef } from 'react'

type FormInputProps = {
  placeHolder?: string
  danger?: boolean
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput(
  props,
  ref,
) {
  const { placeHolder, size = 'sm' } = props

  return (
    <input
      ref={ref}
      type="text"
      placeholder={placeHolder}
      className={classNames(
        'border border-gray-40 w-full rounded placeholder:text-green-60 focus:border-purple-70 bg-gray-20 font-normal text-gray-80 transition-all focus:shadow-purple-90 outline-none',
        {
          'px-3 py-1 text-sm focus:shadow-sm': size === 'sm',
          'px-3 py-3 text-base focus:shadow-md': size === 'md',
          'px-[0.875rem] py-[10px] text-xl focus:shadow-lg': size === 'lg',
        },
      )}
    />
  )
})
