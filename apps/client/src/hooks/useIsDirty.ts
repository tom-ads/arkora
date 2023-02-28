import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseIsDirtyControls {
  reset: () => void
}

export type UseIsDirtyReturn = [boolean, UseIsDirtyControls]

export const useIsDirty = (value: string): UseIsDirtyReturn => {
  const defaultValue = useRef(value)

  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (defaultValue.current !== value && !isDirty) {
      setIsDirty(true)
    }
  }, [value])

  const reset = useCallback(() => setIsDirty(false), [])

  return [isDirty, { reset }]
}
