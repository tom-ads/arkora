import { useEffect, useRef, useState } from 'react'

export const useIsDirty = (value: string) => {
  const defaultValue = useRef(value)

  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (defaultValue.current !== value && !isDirty) {
      setIsDirty(true)
    }
  }, [value])

  return isDirty
}
