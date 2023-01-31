import { RadioGroup } from '@headlessui/react'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { useController } from 'react-hook-form'

type FormStyledRadioProps = {
  name: string
  className?: string
  children: ReactNode
}

export const FormStyledRadio = ({ name, className, children }: FormStyledRadioProps) => {
  const {
    field: { value, onChange },
  } = useController({ name })

  return (
    <RadioGroup
      value={value}
      onChange={onChange}
      className={classNames('w-full flex gap-4', className)}
    >
      {children}
    </RadioGroup>
  )
}
