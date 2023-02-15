import { useDebounce } from '@/hooks/useDebounce'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormInputBaseProps, inputStyling } from '../Input'

export interface FormDebouncedInputProps extends Omit<FormInputBaseProps, 'onChange'> {
  name: string
  value: string
  onChange: (val: string) => void // Override default onChange handler
}

export const FormDebouncedInput = ({
  name,
  size,
  error,
  placeHolder,
  value,
  onChange,
}: FormDebouncedInputProps): JSX.Element => {
  const [inputVal, setInputVal] = useState<string>(value)

  const { register } = useFormContext()

  const debouncedInput = useDebounce<string>(inputVal, 500)

  useEffect(() => {
    onChange(debouncedInput)
  }, [debouncedInput])

  return (
    <input
      {...register(name)}
      type="text"
      name={name}
      value={inputVal}
      onChange={(e) => setInputVal(e.target.value)}
      placeholder={placeHolder}
      className={inputStyling({ size, error })}
    />
  )
}
