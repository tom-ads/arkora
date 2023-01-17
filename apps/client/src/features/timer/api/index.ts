import TimeEntry from '@/types/TimeEntry'
import appApi from 'api'
import { CreateTimerRequest, StartTimerRequest, StopTimerRequest } from './types'

const timerBasePath = '/timers'

const taskEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    createTimer: build.mutation<TimeEntry, CreateTimerRequest>({
      query: (body) => ({
        url: timerBasePath,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['TimeEntries'],
    }),
    startTimer: build.mutation<TimeEntry, StartTimerRequest>({
      query: (params) => ({
        url: `${timerBasePath}/start`,
        method: 'PUT',
        params,
      }),
      invalidatesTags: ['TimeEntries'],
    }),
    stopTimer: build.mutation<TimeEntry, StopTimerRequest>({
      query: (params) => ({
        url: `${timerBasePath}/stop`,
        method: 'PUT',
        params,
      }),
      invalidatesTags: ['TimeEntries'],
    }),
  }),
  overrideExisting: false,
})

export const { useCreateTimerMutation, useStartTimerMutation, useStopTimerMutation } = taskEndpoints
