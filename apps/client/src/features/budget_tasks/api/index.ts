import Task from '@/types/models/Task'
import appApi from 'api'
import {
  CreateBudgetTaskRequest,
  DeleteBudgetTaskRequest,
  GetBudgetTaskRequest,
  UpdateBudgetTaskRequest,
} from './types/request'

const budgetTasksBasePath = '/api/v1/budgets'

const budgetTaskEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    createBudgetTask: build.mutation<Task, CreateBudgetTaskRequest>({
      query: ({ budgetId, ...body }) => ({
        url: `${budgetTasksBasePath}/${budgetId}/tasks`,
        method: 'POST',
        body: {
          name: body.name,
          is_billable: body.isBillable,
        },
      }),
      invalidatesTags: ['BudgetTasks'],
    }),

    getBudgetTasks: build.query<Task[], number | string>({
      query: (budgetId) => `${budgetTasksBasePath}/${budgetId}/tasks`,
      providesTags: ['BudgetTasks'],
    }),

    getBudgetTask: build.query<Task, GetBudgetTaskRequest>({
      query: ({ budgetId, taskId }) => `${budgetTasksBasePath}/${budgetId}/tasks/${taskId}`,
      providesTags: ['BudgetTask'],
    }),

    updateBudgetTask: build.mutation<Task, UpdateBudgetTaskRequest>({
      query: ({ budgetId, taskId, ...body }) => ({
        url: `${budgetTasksBasePath}/${budgetId}/tasks/${taskId}`,
        method: 'PUT',
        body: {
          name: body.name,
          is_billable: body.isBillable,
        },
      }),
      invalidatesTags: ['BudgetTasks', 'BudgetTask'],
    }),

    deleteBudgetTask: build.mutation<void, DeleteBudgetTaskRequest>({
      query: ({ budgetId, taskId }) => ({
        url: `${budgetTasksBasePath}/${budgetId}/tasks/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BudgetTasks', 'BudgetTask'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetBudgetTasksQuery,
  useCreateBudgetTaskMutation,
  useLazyGetBudgetTasksQuery,
  useGetBudgetTaskQuery,
  useDeleteBudgetTaskMutation,
  useUpdateBudgetTaskMutation,
} = budgetTaskEndpoints
