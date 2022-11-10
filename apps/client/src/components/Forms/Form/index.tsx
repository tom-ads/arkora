import classNames from 'classnames'
import { ReactNode, useEffect } from 'react'
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
import { cloneDeep, isEqual } from 'lodash'

type FormProps<TFormValues extends FieldValues, ValidationSchema extends ZodType> = {
  onChange?: (fields: TFormValues) => void
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
  onChange,
  defaultValues,
}: FormProps<TFormValues, ValidationSchema>): JSX.Element => {
  const methods = useForm<TFormValues>({
    mode: 'all',
    defaultValues,
    resolver: validationSchema && zodResolver(validationSchema),
  })

  /*
    Using watch() in useEffect isn't the most optimal solution,
    can be improved in the future.
  */
  useEffect(() => {
    if (onChange) {
      /* 
        We need to deep clone the form state as passing it to redux
        will cause the values to be readonly and throw.

        Cloning will greate a completely new reference each time.
      */
      onChange(cloneDeep(methods.getValues()))
    }
  }, [methods.watch(), onChange])
  console.log(methods.formState.errors)
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
