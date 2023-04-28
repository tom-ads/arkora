import { User } from '@/types'
import appApi from 'api'
import {
  GetAccountsRequest,
  GetAccountRequest,
  UpdateAccountRequest,
  GetInsightsRequest,
} from './types/requests'
import { GetAccountResponse, GetAccountsResponse } from './types/response'

const accountBasePath = '/api/v1/accounts'

const accountEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    getAccounts: build.query<GetAccountsResponse, GetAccountsRequest>({
      query: (params) => ({
        url: accountBasePath,
        params: {
          ...(params?.role && { role: params.role }),
          ...(params?.status && { status: params.status }),
          ...(params?.search && { search: params.search }),
          ...(params?.projectId && { projectId: params.projectId }),
        },
      }),
      providesTags: ['Members'],
    }),

    getAccount: build.query<GetAccountResponse, GetAccountRequest>({
      query: (id) => `${accountBasePath}/${id}`,
      providesTags: ['Member'],
    }),

    updateAccount: build.mutation<User, UpdateAccountRequest>({
      query: ({ id, ...body }) => ({
        url: `${accountBasePath}/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Members', 'Member'],
    }),

    deleteAccount: build.mutation<void, number>({
      query: (id) => ({
        url: `${accountBasePath}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Members'],
    }),

    getAccountsInsights: build.query<User[], GetInsightsRequest>({
      query: (params) => ({
        url: `${accountBasePath}/insights`,
        params: {
          ...(params.projectId && { project_id: params.projectId }),
        },
      }),
      providesTags: ['ProjectMembers'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAccountsQuery,
  useGetAccountQuery,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  useGetAccountsInsightsQuery,
} = accountEndpoints
