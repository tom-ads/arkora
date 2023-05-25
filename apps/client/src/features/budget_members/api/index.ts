import { User } from '@/types'
import appApi from 'api'
import {
  CreateBudgetMembersRequest,
  DeleteBudgetMemberRequest,
  GetBudgetMembersRequest,
} from './types/requests'

const budgetMembersBasePath = '/api/v1/budgets'

const budgetEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    getBudgetMembers: build.query<User[], GetBudgetMembersRequest>({
      query: ({ budgetId, ...params }) => ({
        url: `${budgetMembersBasePath}/${budgetId}/members`,
        params: {
          ...(params.search && { search: params.search }),
        },
      }),
      providesTags: ['BudgetMembers'],
    }),

    createBudgetMember: build.mutation<User, CreateBudgetMembersRequest>({
      query: ({ budgetId, ...body }) => ({
        url: `${budgetMembersBasePath}/${budgetId}/members`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['BudgetMembers'],
    }),

    deleteBudgetMember: build.mutation<void, DeleteBudgetMemberRequest>({
      query: ({ budgetId, memberId }) => ({
        url: `${budgetMembersBasePath}/${budgetId}/members/${memberId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BudgetMembers', 'BudgetMember'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetBudgetMembersQuery,
  useCreateBudgetMemberMutation,
  useDeleteBudgetMemberMutation,
} = budgetEndpoints
