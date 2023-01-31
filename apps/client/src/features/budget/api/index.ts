import { Budget } from '@/types'
import appApi from 'api'
import { CreateBudgetRequest, GetBudgetsRequest } from './types/requests'
import { GetBudgetsResponse } from './types/response'

const budgetBasePath = '/budgets'

const budgetEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    createBudget: build.mutation<Budget, CreateBudgetRequest>({
      query: (body) => ({
        url: budgetBasePath,
        method: 'POST',
        body,
      }),
    }),

    getBudgets: build.query<GetBudgetsResponse, GetBudgetsRequest>({
      query: (params) => ({
        url: budgetBasePath,
        params,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useCreateBudgetMutation, useGetBudgetsQuery } = budgetEndpoints
