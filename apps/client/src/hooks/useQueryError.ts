import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { useEffect } from 'react'
import { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { useToast } from './useToast'

export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error
}

export function useQueryError<TFields extends FieldValues>({
  error,
  setError,
}: {
  setError?: UseFormSetError<TFields>
  error?: FetchBaseQueryError | SerializedError
}) {
  const { errorToast } = useToast()

  useEffect(() => {
    if (isFetchBaseQueryError(error)) {
      const errorData: any = error.data
      if (error.status === 422 && errorData && errorData?.errors && setError) {
        errorData.errors.forEach(({ field, message }: Record<string, string>) => {
          setError(field as Path<TFields>, { message })
        })
      } else if (errorData?.message) {
        if (typeof errorData?.message === 'string') {
          errorToast(errorData?.message)
        } else {
          errorToast(errorData?.message?.[0]?.message)
        }
      }
    }
  }, [error])
}
