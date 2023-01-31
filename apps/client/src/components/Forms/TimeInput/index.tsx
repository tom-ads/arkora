import { useFormContext } from 'react-hook-form'
import { FormInputBaseProps, inputStyling } from '../Input'

interface FormTimeInputProps extends FormInputBaseProps {
  name: string // prevent name from being optional
}

export const FormTimeInput = ({ name, size, error }: FormTimeInputProps): JSX.Element => {
  const { register } = useFormContext()

  return (
    <input id={name} type="time" className={inputStyling({ size, error })} {...register(name)} />
  )
}
