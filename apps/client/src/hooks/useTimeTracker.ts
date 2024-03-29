import {
  useCreateTimerMutation,
  useStartTimerMutation,
  useStopTimerMutation,
} from '@/features/timer'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { CreateTimerRequest } from '@/features/timer'
import { useToast } from './useToast'
import { startTracking, stopTracking } from '@/stores/slices/timer'

export interface UseTimerControls {
  startTimer: (fields: CreateTimerRequest) => Promise<void>
  stopTimer: (timerId?: number) => Promise<void>
  restartTimer: (timeid: number) => Promise<void>
  loading: boolean
}

export function useTimeTracker(): UseTimerControls {
  const dispatch = useDispatch()
  const { errorToast } = useToast()

  const [createTimerMutation, { isLoading: creatingTimer }] = useCreateTimerMutation()
  const [startTimerMutation, { isLoading: startingTimer }] = useStartTimerMutation()
  const [stopTimerMutation, { isLoading: stoppingTimer }] = useStopTimerMutation()

  const startTimer = useCallback(
    async (fields: CreateTimerRequest): Promise<void> => {
      await createTimerMutation(fields)
        .unwrap()
        .then((createdEntry) => dispatch(startTracking(createdEntry)))
        .catch(() => errorToast('We failed to create a new timer.'))
    },
    [createTimerMutation],
  )

  const restartTimer = useCallback(
    async (timerId: number) => {
      await startTimerMutation(timerId)
        .unwrap()
        .then((res) => dispatch(startTracking(res)))
        .catch((error) => errorToast(error?.data?.message ?? 'Unable to restart timer'))
    },
    [startTimerMutation],
  )

  const stopTimer = useCallback(
    async (timerId?: number): Promise<void> => {
      await stopTimerMutation(timerId)
        .unwrap()
        .then(() => dispatch(stopTracking()))
        .catch(() => errorToast('Error occured'))
    },
    [stopTimerMutation],
  )

  return {
    startTimer,
    stopTimer,
    restartTimer,
    loading: creatingTimer || startingTimer || stoppingTimer,
  }
}
