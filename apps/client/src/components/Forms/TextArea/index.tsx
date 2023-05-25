import { VariantProps } from 'class-variance-authority'
import { HTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'
import { inputStyling } from '../Input'

interface FormTextAreaProps
  extends HTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof inputStyling> {
  name: string
  row?: number
  disabled?: boolean
}

export const FormTextArea = ({ name, size, error, ...props }: FormTextAreaProps): JSX.Element => {
  const { register } = useFormContext()

  return (
    <textarea
      id={name}
      rows={props?.row ?? 3}
      className={inputStyling({ size, error })}
      {...props}
      {...register(name)}
    />
  )
}
