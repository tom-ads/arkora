import classNames from 'classnames'
import { Controller } from 'react-hook-form'
import { ChangeEvent } from 'react'

type FormCurrencyInputProps = {
  name: string
  placeHolder?: string
  prefix: string
  control: any
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
}

export const FormCurrencyInput = ({
  name,
  control,
  prefix,
  size = 'md',
  placeHolder = '00.00',
  error,
}: FormCurrencyInputProps): JSX.Element => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
          const splitNumber = e.target.value?.split('.')
          field.onChange(
            splitNumber?.[1]?.length > 2
              ? `${splitNumber[0]}.${splitNumber[1].slice(0, 2)}`
              : e.target.value,
          )
        }

        return (
          <div className="w-full relative">
            <span
              className={classNames(
                'absolute inset-y-0 font-medium text-gray-100 grid place-content-center',
                {
                  'pl-3 text-base': size === 'sm',
                  'px-3 py-3 text-base focus:shadow-md': size === 'md',
                  'px-[0.875rem] py-[10px] text-xl focus:shadow-lg': size === 'lg',
                },
              )}
            >
              {prefix}
            </span>
            <input
              {...field}
              type="number"
              value={field.value}
              onChange={handleChange}
              placeholder={placeHolder}
              className={classNames(
                'border border-gray-40 w-full rounded placeholder:text-green-60 font-normal text-gray-100 transition-all outline-none appearance-none',
                {
                  'pr-3 pl-7 py-2 text-sm focus:shadow-sm': size === 'sm',
                  'px-3 py-3 text-base focus:shadow-md': size === 'md',
                  'px-[0.875rem] py-[10px] text-xl focus:shadow-lg': size === 'lg',

                  'focus:shadow-purple-70 focus:border-purple-90': !error,
                  'border-red-90 focus:shadow-md focus:shadow-red-90': error,
                },
              )}
            />
          </div>
        )
      }}
    />
  )
}
