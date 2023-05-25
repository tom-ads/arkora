import { useDebounce } from '@/hooks/useDebounce'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
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
  className,
  onChange,
}: FormDebouncedInputProps): JSX.Element => {
  const [inputVal, setInputVal] = useState<string>(value)

  const debouncedInput = useDebounce<string>(inputVal, 500)

  useEffect(() => {
    onChange(debouncedInput)
  }, [debouncedInput])

  return (
    <input
      type="text"
      name={name}
      value={inputVal}
      onChange={(e) => setInputVal(e.target.value)}
      placeholder={placeHolder}
      className={classNames(inputStyling({ size, error }), className)}
    />
  )
}
