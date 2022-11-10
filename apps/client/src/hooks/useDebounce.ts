import { useEffect, useState } from 'react'

export const useDebounce = <T>(value: T, duration: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, duration)

    return () => clearTimeout(timeout)
  }, [value, duration])

  return debouncedValue
}
