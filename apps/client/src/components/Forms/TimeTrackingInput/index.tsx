import { timeToMinutes } from '@/helpers/tracking'
import { VariantProps } from 'class-variance-authority'
import { ChangeEvent, HTMLAttributes } from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'
import { input } from '../Input'

export interface TimeEntryResult {
  original: string
  durationMinutes: number
}

interface FormTrackingInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends HTMLAttributes<HTMLInputElement>,
    VariantProps<typeof input> {
  name: TFieldName
  control: Control<TFieldValues>
}

export const FormTimeTrackingInput = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  size,
  error,
}: FormTrackingInputProps<TFieldValues, TFieldName>): JSX.Element => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const onChange = (e: ChangeEvent<HTMLInputElement>) => {
          const time = e.target.value

          let durationMinutes = 0
          if (time) {
            durationMinutes = timeToMinutes(time)
          }

          field.onChange({
            durationMinutes,
            original: time,
          })
        }

        return (
          <input
            id={name}
            value={field.value?.original ?? '00:00'}
            onChange={onChange}
            type="time"
            className={input({ size, error })}
          />
        )
      }}
    />
  )
}
