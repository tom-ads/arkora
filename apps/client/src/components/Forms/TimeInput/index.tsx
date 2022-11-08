import classNames from 'classnames'
import { useFormContext } from 'react-hook-form'

type FormTimeInputProps = {
  name: string
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
}

export const FormTimeInput = ({ name, size = 'sm', error }: FormTimeInputProps): JSX.Element => {
  const { register } = useFormContext()

  return (
    <input
      id={name}
      type="time"
      {...register(name)}
      className={classNames(
        'border border-gray-40 w-full rounded placeholder:text-green-60 font-normal text-gray-80 transition-all outline-none appearance-none',
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
