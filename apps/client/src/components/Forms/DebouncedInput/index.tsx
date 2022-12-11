import { useDebounce } from '@/hooks/useDebounce'
import { VariantProps } from 'class-variance-authority'
import { HTMLAttributes, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { input } from '../Input'

interface FormDebouncedInputProps
  extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange'>,
    VariantProps<typeof input> {
  name: string
  placeHolder?: string
  value: string
  // Override default onChange handler
  onChange: (val: string) => void
}

export const FormDebouncedInput = ({
  name,
  size,
  error,
  placeHolder,
  value,
  onChange,
}: FormDebouncedInputProps): JSX.Element => {
  const { register } = useFormContext()

  const [inputVal, setInputVal] = useState<string>(value)

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
      className={input({ size, error })}
    />
  )
}
