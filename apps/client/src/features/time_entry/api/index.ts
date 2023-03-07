import TimeEntry from '@/types/TimeEntry'
import appApi from 'api'
import { GetTimeEntriesRequest } from './request'
import { stringify } from 'qs'

const timeEntryBasePath = '/entries'

const timeEntryEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    getTimeEntries: build.query<TimeEntry[], GetTimeEntriesRequest>({
      query: (params) => ({
        url: `${timeEntryBasePath}?${stringify(
          {
            ...(params?.project_id && { project_id: params.project_id }),
            ...(params?.budget_id && { budget_id: params.budget_id }),
            ...(params?.task_id && { task_id: params.task_id }),
            ...(params?.members && { members: params.members }),
            ...(params?.start_date && { task_id: params.start_date }),
            ...(params?.end_date && { task_id: params.end_date }),
            ...(params?.billable && { billable: params.billable }),
          },
          { arrayFormat: 'brackets', encode: false },
        )}`,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetTimeEntriesQuery } = timeEntryEndpoints
