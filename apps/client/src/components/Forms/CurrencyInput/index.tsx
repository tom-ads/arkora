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
    if (value) {
      const removeSeperators = value.replace('.', '')
      onChange(parseInt(removeSeperators, 10))
      return
    }

    onChange(undefined)
  }

  return (
    <div className="w-full relative">
      <CurrencyInput
        allowDecimals={false}
        allowNegativeValue={false}
        className={inputStyling({ size, error })}
        placeholder={placeHolder}
        value={value}
        disabled={!!disabled}
        onValueChange={handleOnChange}
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
