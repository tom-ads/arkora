import appApi from 'api'
import { GetBudgetsRequest } from './types/requests'
import { GetBudgetsResponse } from './types/response'

const budgetBasePath = '/budgets'

const budgetEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    getBudgets: build.query<GetBudgetsResponse, GetBudgetsRequest>({
      query: (params) => ({
        url: budgetBasePath,
        params,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetBudgetsQuery } = budgetEndpoints
