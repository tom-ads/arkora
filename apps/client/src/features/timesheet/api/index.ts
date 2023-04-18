import TimeEntry from '@/types/models/TimeEntry'
import appApi from 'api'
import { GetTimesheetRequest, GetTimesheetsRequest } from './types/request'
import { GetTimesheetResponse } from './types/response'

const timesheetBasePath = '/api/v1/timesheets'

const timesheetEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    getTimesheet: build.query<TimeEntry[], GetTimesheetRequest>({
      query: ({ userId, ...params }) => ({
        url: `${timesheetBasePath}/${userId}`,
        params,
      }),
      providesTags: ['TimeEntries', 'TimeEntry'],
    }),

    getTimesheets: build.query<GetTimesheetResponse, GetTimesheetsRequest>({
      query: (params) => ({
        url: timesheetBasePath,
        params,
      }),
      providesTags: ['TimeEntries'],
    }),
  }),
  overrideExisting: false,
})

export const { useGetTimesheetsQuery, useGetTimesheetQuery } = timesheetEndpoints
