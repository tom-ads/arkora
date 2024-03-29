import { FormEvent, ReactNode, useEffect } from 'react'
import {
  DeepPartial,
  FieldValues,
  FormProvider,
  useForm,
  UseFormReturn,
  ValidationMode,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType } from 'zod'
import { cloneDeep, isEqual } from 'lodash'
import { useQueryError } from '@/hooks/useQueryError'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { SerializedError } from '@reduxjs/toolkit'
import { twMerge } from 'tailwind-merge'

export type FormChangeCallback<TFormValues extends FieldValues> = (
  fields: TFormValues,
  methods: UseFormReturn<TFormValues>,
) => void

export type FormProps<TFormValues extends FieldValues, ValidationSchema extends ZodType> = {
  onChange?: (fields: TFormValues, methods: UseFormReturn<TFormValues>) => void
  onSubmit?: (fields: TFormValues, methods: UseFormReturn<TFormValues>) => void
  className?: string
  validationSchema?: ValidationSchema
  children: (methods: UseFormReturn<TFormValues>) => ReactNode
  defaultValues?: DeepPartial<TFormValues>
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

  useQueryError<TFormValues>({ setError: methods.setError, error: queryError })

  /*
    Using watch() in useEffect isn't the most optimal solution,
    can be improved in the future.
  */
  useEffect(() => {
    if (onChange) {
      /* 
        We need to deep clone the form state as passing it to redux
        will cause the values to be readonly and throw.

        Cloning will create a completely new reference.
      */
      onChange(cloneDeep(methods.getValues()), methods)
    }
  }, [methods.watch(), onChange])

  /* 
    When defaultValues is set initially, there might be an async operation
    awaiting i.e network request. When the network request returns with nested
    data i.e objects and arrays there is no way to update defaultValues for
    those fields. So, we need to manually check for these changes and reset the
    form so it accurately represents the defaultValues.
  */
  useEffect(() => {
    if (!isEqual(methods.formState.defaultValues, defaultValues)) {
      methods.reset(defaultValues)
    }
  }, [defaultValues])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (onSubmit) {
      methods.handleSubmit((data: TFormValues) => onSubmit(data, methods))(event)
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="w-full">
        <fieldset className={twMerge('flex flex-col w-full min-w-0', className)}>
          {children(methods)}
        </fieldset>
      </form>
    </FormProvider>
  )
}
