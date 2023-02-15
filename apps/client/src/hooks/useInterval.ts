import { useEffect, useRef } from 'react'

export function useInterval(callback: () => void, delay: number | null) {
  const callbackRef = useRef<() => void>()

  // After render, set the callback fn
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!delay) {
      return
    }

    const interval = setInterval(() => callbackRef.current?.(), delay)
    return () => clearInterval(interval)
  }, [delay])
}
