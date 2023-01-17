import {
  useCreateTimerMutation,
  useStartTimerMutation,
  useStopTimerMutation,
} from '@/features/timer'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useInterval } from './useInterval'
import { CreateTimerRequest } from '@/features/timer'
import { useToast } from './useToast'
import { endTimer, startTimer } from '@/stores/slices/timer'

export interface UseTimerControls {
  startTracking: (fields: CreateTimerRequest) => Promise<void>
  stopTracking: (timerId?: number) => Promise<void>
  restartTracking: (timeid: number) => Promise<void>
  trackingLoading: boolean
}

export type UseTimeTrackerReturn = [number, UseTimerControls]

export function useTimeTracker(delay?: number): UseTimeTrackerReturn {
  const dispatch = useDispatch()
  const { errorToast } = useToast()

  const [createTimerMutation, { isLoading: creatingTimer }] = useCreateTimerMutation()
  const [startTimerMutation, { isLoading: startingTimer }] = useStartTimerMutation()
  const [stopTimerMutation, { isLoading: stoppingTimer }] = useStopTimerMutation()

  const [isPlaying, setIsPlaying] = useState(false)
  const [increment, setIncrement] = useState<number>(0)

  const startTracking = useCallback(
    async (fields: CreateTimerRequest): Promise<void> => {
      await createTimerMutation(fields)
        .unwrap()
        .then((res) => {
          dispatch(startTimer(res))
          setIsPlaying(true)
        })
        .catch(() => errorToast('Error occured'))
    },
    [createTimerMutation],
  )

  const restartTracking = useCallback(
    async (timerId: number) => {
      await startTimerMutation({ timer_id: timerId })
        .unwrap()
        .then((res) => {
          setIsPlaying(true)
          dispatch(startTimer(res))
          setIncrement(res.durationMinutes)
        })
        .catch(() => errorToast('Error occured'))
    },
    [startTimerMutation],
  )

  const stopTracking = useCallback(
    async (timerId?: number): Promise<void> => {
      await stopTimerMutation({ timer_id: timerId })
        .unwrap()
        .then(() => {
          dispatch(endTimer())
          setIsPlaying(false)
          setIncrement(0)
        })
        .catch(() => errorToast('Error occured'))
    },
    [stopTimerMutation],
  )

  useInterval(() => setIncrement(increment + 1), isPlaying ? delay ?? 1000 : null)

  return [
    increment,
    {
      startTracking,
      stopTracking,
      restartTracking,
      trackingLoading: creatingTimer || startingTimer || stoppingTimer,
    },
  ]
}
