import { useEffect, useState } from 'react'

/* 
  useDebounce Hook

  useEffect starts a timeout along with a cleanup callback
  to clear the timeout each time the value prop changes. This
  restarts the timeout, preventing the debouncedValue state from
  being updated, giving the debounce effect.
*/
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
