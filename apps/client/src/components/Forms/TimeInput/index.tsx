import { VariantProps } from 'class-variance-authority'
import { HTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'
import { input } from '../Input'

interface FormTimeInputProps extends HTMLAttributes<HTMLInputElement>, VariantProps<typeof input> {
  name: string
}

export const FormTimeInput = ({ name, size, error }: FormTimeInputProps): JSX.Element => {
  const { register } = useFormContext()

  return <input id={name} type="time" className={input({ size, error })} {...register(name)} />
}
