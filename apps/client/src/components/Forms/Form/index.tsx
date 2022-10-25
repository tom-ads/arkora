import classNames from 'classnames'
import { ReactNode } from 'react'
import { FieldValues, SubmitHandler, useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType } from 'zod'

type FormProps<TFormValues extends FieldValues, ValidationSchema extends ZodType> = {
  onSubmit: SubmitHandler<TFormValues>
  className?: string
  validationSchema?: ValidationSchema
  children: (methods: UseFormReturn<TFormValues>) => ReactNode
}

export const Form = <TFormValues extends FieldValues, ValidationSchema extends ZodType>({
  onSubmit,
  className,
  validationSchema,
  children,
}: FormProps<TFormValues, ValidationSchema>): JSX.Element => {
  const methods = useForm<TFormValues>({
    resolver: validationSchema ? zodResolver(validationSchema) : undefined,
  })

  return (
    <form
      className={classNames('flex flex-col gap-6 w-full', className)}
      onSubmit={methods.handleSubmit(onSubmit)}
    >
      {children(methods)}
    </form>
  )
}
