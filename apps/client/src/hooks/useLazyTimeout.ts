import { useEffect, useRef, useState } from 'react'

type UseLazyTimeoutParams = {
  callback?: () => void
  delay: number
}

type UseLazyTimeoutReturn = [boolean, () => void]

export const useLazyTimeout = ({ callback, delay }: UseLazyTimeoutParams): UseLazyTimeoutReturn => {
  const callbackRef = useRef<null | (() => void)>(null)

  const [toggled, setToggled] = useState(false)

  useEffect(() => {
    if (callback) {
      callbackRef.current = callback
    }
  }, [callback])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setToggled(false)
      callbackRef?.current?.()
    }, delay)

    return () => clearTimeout(timeout)
  }, [delay, toggled])

  const trigger = () => {
    if (!toggled) {
      setToggled(true)
      if (callback) {
        callbackRef.current = callback
      }
    }
  }

  return [toggled, trigger]
}
