import classNames from 'classnames'
import { Controller } from 'react-hook-form'
import { ChangeEvent, HTMLAttributes } from 'react'
import { VariantProps } from 'class-variance-authority'
import { input } from '../Input'

interface FormCurrencyInputProps
  extends HTMLAttributes<HTMLInputElement>,
    VariantProps<typeof input> {
  name: string
  control: any
  prefix: string
  placeHolder: string
}

export const FormCurrencyInput = ({
  name,
  control,
  prefix,
  size,
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
              className={`${input({ size, error })} pl-7`}
            />
          </div>
        )
      }}
    />
  )
}
