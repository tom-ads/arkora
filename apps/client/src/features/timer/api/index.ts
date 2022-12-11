import appApi from 'api'
import { CreateTimerRequest, CreateTimerResponse } from './types'

const timerBasePath = '/timers'

const taskEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    createTimer: build.mutation<CreateTimerResponse, CreateTimerRequest>({
      query: (body) => ({
        url: timerBasePath,
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useCreateTimerMutation } = taskEndpoints
