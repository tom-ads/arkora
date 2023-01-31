import { EyeClosedIcon } from '@/components/Icons/EyeClosedIcon'
import { EyeOpenIcon } from '@/components/Icons/EyeOpenIcon'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormInputBaseProps, inputStyling } from '../Input'

export interface FormPasswordInputProps extends FormInputBaseProps {
  name: string // prevent name from being optional
}

export const FormPasswordInput = ({
  name,
  size,
  placeHolder,
  error,
}: FormPasswordInputProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false)

  const { register } = useFormContext()

  return (
    <div className="w-full relative">
      <input
        id={name}
        placeholder={placeHolder}
        className={inputStyling({ size, error })}
        type={showPassword ? 'text' : 'password'}
        {...register(name)}
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
