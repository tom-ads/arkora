import TimeEntry from '@/types/models/TimeEntry'
import appApi from 'api'
import { CreateTimerRequest, GetTimersResponse } from './types'

const timerBasePath = '/api/v1/timers'

const taskEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    getTimers: build.query<GetTimersResponse, void>({
      query: () => timerBasePath,
      providesTags: ['TimeEntries'],
    }),

    createTimer: build.mutation<TimeEntry, CreateTimerRequest>({
      query: (body) => ({
        url: timerBasePath,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['TimeEntries'],
    }),

    startTimer: build.mutation<TimeEntry, number>({
      query: (id) => ({
        url: `${timerBasePath}/${id}/start`,
        method: 'PUT',
      }),
      invalidatesTags: ['TimeEntries'],
    }),

    stopTimer: build.mutation<TimeEntry, number | undefined>({
      query: (id) => ({
        url: `${timerBasePath}/stop`,
        method: 'PUT',
        params: {
          ...(id && { timer_id: id }),
        },
      }),
      invalidatesTags: ['TimeEntries'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useCreateTimerMutation,
  useGetTimersQuery,
  useStartTimerMutation,
  useStopTimerMutation,
} = taskEndpoints
