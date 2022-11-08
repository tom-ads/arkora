import { EyeClosedIcon } from '@/components/Icons/EyeClosedIcon'
import { EyeOpenIcon } from '@/components/Icons/EyeOpenIcon'
import classNames from 'classnames'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

type PasswordInputProps = {
  name: string
  placeHolder: string
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
}

export const PasswordInput = ({
  name,
  size,
  error,
  placeHolder,
}: PasswordInputProps): JSX.Element => {
  const { register } = useFormContext()

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full relative">
      <input
        id={name}
        {...register(name)}
        placeholder={placeHolder}
        type={showPassword ? 'text' : 'password'}
        className={classNames(
          'border border-gray-40 w-full rounded placeholder:text-green-60 font-normal text-gray-80 transition-all outline-none',
          {
            'px-3 py-2 text-sm focus:shadow-sm': size === 'sm',
            'px-3 py-3 text-base focus:shadow-md': size === 'md',
            'px-[0.875rem] py-[10px] text-xl focus:shadow-lg': size === 'lg',

            'focus:shadow-purple-70 focus:border-purple-90': !error,
            'border-red-90 focus:shadow-md focus:shadow-red-90': error,
          },
        )}
      />

      <div className="absolute inset-y-0 right-[12px] flex items-center">
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="w-4 h-4 outline-none focus-visible:text-purple-90 hover:text-purple-90"
        >
          {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
        </button>
      </div>
    </div>
  )
}
