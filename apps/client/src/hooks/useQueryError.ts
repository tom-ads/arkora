import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { useEffect, useState } from 'react'
import { FieldValues, Path, UseFormSetError } from 'react-hook-form'

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error
}

export function useQueryError<TFields extends FieldValues>({
  error,
  setError,
}: {
  setError?: UseFormSetError<TFields>
  error?: FetchBaseQueryError | SerializedError
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (isFetchBaseQueryError(error)) {
      const errorData: any = error.data
      if (error.status === 422 && errorData && errorData?.errors && setError) {
        errorData.errors.forEach(({ field, message }: Record<string, string>) => {
          setError(field as Path<TFields>, { message })
        })
      } else if (errorData?.message) {
        setErrorMessage(errorData?.message as string)
      }
    }
  }, [error, setError])

  return [errorMessage]
}
