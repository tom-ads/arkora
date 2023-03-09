import TimeEntry from '@/types/models/TimeEntry'
import appApi from 'api'
import { GetTimeEntriesRequest, UpdateTimeEntryRequest } from './request'
import { stringify } from 'qs'

const timeEntryBasePath = '/entries'

const timeEntryEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    getTimeEntries: build.query<TimeEntry[], GetTimeEntriesRequest>({
      query: (params) => ({
        url: `${timeEntryBasePath}?${stringify(
          {
            ...(params?.projectId && { project_id: params.projectId }),
            ...(params?.budgets && { budgets: params.budgets }),
            ...(params?.tasks && { tasks: params.tasks }),
            ...(params?.members && { members: params.members }),
            ...(params?.startDate && { start_date: params.startDate }),
            ...(params?.endDate && { end_date: params.endDate }),
            ...(params?.billable && { billable: params.billable }),
          },
          { arrayFormat: 'brackets', encode: false },
        )}`,
      }),
      providesTags: ['TimeEntries'],
    }),

    getTimeEntry: build.query<TimeEntry, number>({
      query: (id) => `${timeEntryBasePath}/${id}`,
      providesTags: ['TimeEntry'],
    }),

    updateTimeEntry: build.mutation<TimeEntry, UpdateTimeEntryRequest>({
      query: ({ timer_id, ...body }) => ({
        url: `${timeEntryBasePath}/${timer_id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['TimeEntries', 'TimeEntry'],
    }),

    deleteTimeEntry: build.mutation<void, number>({
      query: (id) => ({
        url: `${timeEntryBasePath}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TimeEntries'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetTimeEntriesQuery,
  useDeleteTimeEntryMutation,
  useGetTimeEntryQuery,
  useUpdateTimeEntryMutation,
} = timeEntryEndpoints
