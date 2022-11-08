import classNames from 'classnames'
import { ReactNode } from 'react'
import {
  DeepPartial,
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType } from 'zod'

type FormProps<TFormValues extends FieldValues, ValidationSchema extends ZodType> = {
  onSubmit: SubmitHandler<TFormValues>
  className?: string
  validationSchema?: ValidationSchema
  children: (methods: UseFormReturn<TFormValues>) => ReactNode
  defaultValues: DeepPartial<TFormValues>
}

export const Form = <TFormValues extends FieldValues, ValidationSchema extends ZodType>({
  onSubmit,
  className,
  validationSchema,
  children,
  defaultValues,
}: FormProps<TFormValues, ValidationSchema>): JSX.Element => {
  const methods = useForm<TFormValues>({
    defaultValues,
    resolver: validationSchema && zodResolver(validationSchema),
  })

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col gap-6 w-full', className)}
      >
        <fieldset className="w-full">{children(methods)}</fieldset>
      </form>
    </FormProvider>
  )
}
