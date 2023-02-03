import classNames from 'classnames'
import NumberInput from 'react-currency-input-field'
import { useController } from 'react-hook-form'
import { FormInputBaseProps, inputStyling } from '../Input'

export interface FormNumberInputProps extends FormInputBaseProps {
  name: string // prevent name from being optional
  suffix?: string
}

export const FormNumberInput = ({
  name,
  suffix,
  size,
  error,
  disabled,
  placeHolder,
  className,
}: FormNumberInputProps): JSX.Element => {
  const {
    field: { value, onChange },
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
    <div className="relative w-full">
      <NumberInput
        value={value}
        onValueChange={handleOnChange}
        className={classNames(
          inputStyling({ size, error }),
          {
            'pr-11': suffix,
          },
          className,
        )}
        disabled={!!disabled}
        allowDecimals={false}
        placeholder={placeHolder}
        allowNegativeValue={false}
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
