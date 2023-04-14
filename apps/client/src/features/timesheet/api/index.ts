import TimeEntry from '@/types/models/TimeEntry'
import appApi from 'api'
import { GetTimesheetRequest, GetTimesheetsRequest } from './types/request'
import { GetTimesheetResponse } from './types/response'

const timesheetBasePath = '/api/v1/timesheets'

const timesheetEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    getTimesheet: build.query<TimeEntry[], GetTimesheetRequest>({
      query: (params) => ({
        url: `${timesheetBasePath}/${params.userId}`,
        params: {
          start_date: params.startDate,
          end_date: params.endDate,
          user: params.userId,
        },
      }),
      providesTags: ['TimeEntries', 'TimeEntry'],
    }),

    getTimesheets: build.query<GetTimesheetResponse, GetTimesheetsRequest>({
      query: (params) => ({
        url: timesheetBasePath,
        params: {
          start_date: params.startDate,
          end_date: params.endDate,
        },
      }),
      providesTags: ['TimeEntries'],
    }),
  }),
  overrideExisting: false,
})

export const { useGetTimesheetsQuery, useGetTimesheetQuery } = timesheetEndpoints
