import { useRef } from 'react'

/* 
  useIsInitialRender Hook

  Ref doesn't trigger re-render, but after initial render
  ref.current is false.
*/
export const useIsInitialRender = () => {
  const initialRenderRef = useRef(true)

  if (initialRenderRef.current) {
    initialRenderRef.current = false

    return true
  }

  return initialRenderRef.current
}
