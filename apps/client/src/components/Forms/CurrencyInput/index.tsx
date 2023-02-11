import classNames from 'classnames'
import { useController } from 'react-hook-form'
import { HTMLAttributes } from 'react'
import { VariantProps } from 'class-variance-authority'
import { inputStyling } from '../Input'
import CurrencyInput from 'react-currency-input-field'

interface FormCurrencyInputProps
  extends HTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputStyling> {
  name: string
  suffix: string
  placeHolder?: string
}

export const FormCurrencyInput = ({
  name,
  suffix,
  size,
  placeHolder = '00',
  error,
  disabled,
}: FormCurrencyInputProps): JSX.Element => {
  const {
    field: { onChange, value },
  } = useController({ name })

  const handleOnChange = (value: string | undefined): void => {
    onChange(value ? parseInt(value, 10) : null)
  }

  return (
    <div className="w-full relative">
      <CurrencyInput
        allowDecimals={false}
        allowNegativeValue={false}
        className={inputStyling({ size, error })}
        placeholder={placeHolder}
        disabled={!!disabled}
        value={value ?? ''}
        onValueChange={(_value, _formatted, options) => handleOnChange(options?.value)}
      />
      {suffix && (
        <span
          className={classNames(
            'absolute inset-y-0 right-4 font-medium text-gray-100 grid place-content-center',
            {
              'pl-3 text-base': size === 'sm',
              'px-3 py-3 text-base focus:shadow-md': size === 'md',
              'px-[0.875rem] py-[10px] text-xl focus:shadow-lg': size === 'lg',
            },
          )}
        >
          {suffix}
        </span>
      )}
    </div>
  )
}
