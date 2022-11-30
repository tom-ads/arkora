import classNames from 'classnames'
import { ReactNode, useEffect } from 'react'
import {
  DeepPartial,
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
  UseFormReturn,
  ValidationMode,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType } from 'zod'
import { cloneDeep } from 'lodash'
import { useQueryError } from '@/hooks/useQueryError'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { SerializedError } from '@reduxjs/toolkit'

type FormProps<TFormValues extends FieldValues, ValidationSchema extends ZodType> = {
  onChange?: (fields: TFormValues) => void
  onSubmit: SubmitHandler<TFormValues>
  className?: string
  validationSchema?: ValidationSchema
  children: (methods: UseFormReturn<TFormValues>) => ReactNode
  defaultValues: DeepPartial<TFormValues>
  mode?: keyof ValidationMode
  queryError?: FetchBaseQueryError | SerializedError
}

export const Form = <TFormValues extends FieldValues, ValidationSchema extends ZodType>({
  onSubmit,
  className,
  validationSchema,
  children,
  onChange,
  defaultValues,
  mode = 'all',
  queryError,
}: FormProps<TFormValues, ValidationSchema>): JSX.Element => {
  const methods = useForm<TFormValues>({
    mode,
    defaultValues,
    resolver: validationSchema && zodResolver(validationSchema),
  })

  useQueryError<TFormValues>(methods.setError, queryError)

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

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full">
        <fieldset className={classNames('flex flex-col w-full', className)}>
          {children(methods)}
        </fieldset>
      </form>
    </FormProvider>
  )
}
