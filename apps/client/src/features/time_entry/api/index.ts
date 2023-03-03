import TimeEntry from '@/types/TimeEntry'
import appApi from 'api'
import { GetTimeEntriesRequest } from './request'

const timeEntryBasePath = '/entries'

const timeEntryEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    getTimeEntries: build.query<TimeEntry[], GetTimeEntriesRequest>({
      query: (params) => ({
        url: timeEntryBasePath,
        params: {
          ...(params?.project_id && { project_id: params.project_id }),
          ...(params?.budget_id && { budget_id: params.budget_id }),
          ...(params?.task_id && { task_id: params.task_id }),
          ...(params?.user_id && { task_id: params.user_id }),
          ...(params?.start_date && { task_id: params.start_date }),
          ...(params?.end_date && { task_id: params.end_date }),
        },
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetTimeEntriesQuery } = timeEntryEndpoints
