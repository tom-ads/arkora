import { useDebounce } from '@/hooks/useDebounce'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

type FormDebouncedInputBaseProps = {
  name: string
  placeHolder?: string
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  value: string
  onChange: (val: string) => void
}

export const FormDebouncedInput = ({
  name,
  size = 'sm',
  error,
  placeHolder,
  value,
  onChange,
}: FormDebouncedInputBaseProps): JSX.Element => {
  const { register } = useFormContext()

  const [input, setInput] = useState<string>(value)

  const debouncedInput = useDebounce<string>(input, 500)

  useEffect(() => {
    onChange(debouncedInput)
  }, [debouncedInput])

  return (
    <input
      {...register(name)}
      type="text"
      name={name}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder={placeHolder}
      className={classNames(
        'border border-gray-40 w-full rounded placeholder:text-gray-60 font-normal text-gray-80 transition-all outline-none',
        {
          'px-3 py-2 text-sm focus:shadow-sm': size === 'sm',
          'px-3 py-3 text-base focus:shadow-md': size === 'md',
          'px-[0.875rem] py-[10px] text-xl focus:shadow-lg': size === 'lg',

          'focus:shadow-purple-70 focus:border-purple-90': !error,
          'border-red-90 focus:shadow-md focus:shadow-red-90': error,
        },
      )}
    />
  )
}
