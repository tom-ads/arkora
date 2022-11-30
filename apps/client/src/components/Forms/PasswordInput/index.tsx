import { EyeClosedIcon } from '@/components/Icons/EyeClosedIcon'
import { EyeOpenIcon } from '@/components/Icons/EyeOpenIcon'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormInputProps, input } from '../Input'

export const FormPasswordInput = ({
  name,
  size,
  placeHolder,
  error,
}: FormInputProps): JSX.Element => {
  const { register } = useFormContext()

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full relative">
      <input
        id={name}
        {...register(name)}
        placeholder={placeHolder}
        className={input({ size, error })}
        type={showPassword ? 'text' : 'password'}
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
