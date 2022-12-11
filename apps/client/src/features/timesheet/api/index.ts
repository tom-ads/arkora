import appApi from 'api'
import { GetTimesheetRequest } from './types/request'
import { GetTimesheetResponse } from './types/response'

const timesheetBasePath = '/timesheets'

const timesheetEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    getTimesheet: build.query<GetTimesheetResponse, GetTimesheetRequest>({
      query: (params) => ({
        url: timesheetBasePath,
        params,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetTimesheetQuery } = timesheetEndpoints
