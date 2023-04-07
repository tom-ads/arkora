import { User } from '@/types'
import appApi from 'api'
import { CreateBudgetMembersRequest } from './types/requests'

const budgetMembersBasePath = '/budgets'

const budgetEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    getBudgetMembers: build.query<User[], number | string>({
      query: (budgetId) => `${budgetMembersBasePath}/${budgetId}/members`,
    }),

    createBudgetMember: build.mutation<User, CreateBudgetMembersRequest>({
      query: ({ budgetId, ...body }) => ({
        url: `${budgetMembersBasePath}/${budgetId}/members`,
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetBudgetMembersQuery, useCreateBudgetMemberMutation } = budgetEndpoints
