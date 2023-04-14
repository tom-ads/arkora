import { Budget } from '@/types'
import appApi from 'api'
import {
  CreateBudgetRequest,
  GetBudgetRequest,
  GetBudgetsRequest,
  UpdateBudgetRequest,
} from './types/requests'
import { GetBudgetsResponse } from './types/response'

const budgetBasePath = '/api/v1/budgets'

const budgetEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    createBudget: build.mutation<Budget, CreateBudgetRequest>({
      query: (body) => ({
        url: budgetBasePath,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Budgets', 'Budget'],
    }),

    getBudget: build.query<Budget, GetBudgetRequest>({
      query: (id) => `${budgetBasePath}/${id}`,
      providesTags: ['Budget'],
    }),

    getBudgets: build.query<GetBudgetsResponse, GetBudgetsRequest>({
      query: (params) => ({
        url: budgetBasePath,
        params: {
          ...(params.projectId && { project_id: params.projectId }),
          ...(params.userId && { user_id: params.userId }),
          ...(params.includeProject && { include_project: params.includeProject }),
        },
      }),
      providesTags: ['Budgets'],
    }),

    updateBudget: build.mutation<Budget, UpdateBudgetRequest>({
      query: (body) => ({
        url: `${budgetBasePath}/${body.budget_id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Budgets', 'Budget'],
    }),

    deleteBudget: build.mutation<void, number>({
      query: (id) => ({
        url: `${budgetBasePath}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Budgets', 'Budget'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useCreateBudgetMutation,
  useGetBudgetQuery,
  useGetBudgetsQuery,
  useDeleteBudgetMutation,
  useUpdateBudgetMutation,
} = budgetEndpoints
