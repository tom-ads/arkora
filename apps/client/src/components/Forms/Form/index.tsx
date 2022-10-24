import classNames from 'classnames'
import { FormEventHandler, ReactNode } from 'react'
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form'

type FormProps<TFormValues extends FieldValues> = {
  onSubmit?: FormEventHandler<HTMLFormElement>
  className?: string
  children: (methods: UseFormReturn<TFormValues>) => ReactNode
}

export const Form = <TFormValues extends FieldValues>({
  onSubmit,
  className,
  children,
}: FormProps<TFormValues>): JSX.Element => {
  const methods = useForm<TFormValues>()
  return (
    <form className={classNames('flex flex-col gap-6 w-full', className)} onSubmit={onSubmit}>
      {children(methods)}
    </form>
  )
}
