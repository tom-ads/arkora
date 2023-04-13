import appApi from 'api'
import { GetTasksRequest } from './types/request'
import { GetTasksResponse } from './types/response'

const tasksBasePath = '/api/v1/tasks'

const taskEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksResponse, GetTasksRequest>({
      query: (params) => ({
        url: tasksBasePath,
        params: {
          ...(params.budgetId && { budget_id: params.budgetId }),
        },
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetTasksQuery, useLazyGetTasksQuery } = taskEndpoints
