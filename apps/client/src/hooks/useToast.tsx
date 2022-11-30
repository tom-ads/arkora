import { Toast } from '@/components'
import { useCallback } from 'react'
import { useNotifier } from 'react-headless-notifier'

export function useToast() {
  const { notify } = useNotifier()

  const defaultToast = useCallback((message: string) => {
    notify(<Toast variant="default" message={message} />)
  }, [])

  const successToast = useCallback((message: string) => {
    notify(<Toast variant="success" message={message} />)
  }, [])

  const warningToast = useCallback((message: string) => {
    notify(<Toast variant="warning" message={message} />)
  }, [])

  const errorToast = useCallback((message: string) => {
    notify(<Toast variant="error" message={message} />)
  }, [])

  return { defaultToast, successToast, warningToast, errorToast }
}
