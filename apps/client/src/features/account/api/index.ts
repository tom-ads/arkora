import { User } from '@/types'
import appApi from 'api'
import { GetAccountsRequest, GetAccountRequest, UpdateAccountRequest } from './types/requests'
import { GetAccountResponse, GetAccountsResponse } from './types/response'

const accountBasePath = '/accounts'

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
      invalidatesTags: ['Members'],
    }),

    deleteAccount: build.mutation<void, number>({
      query: (id) => ({
        url: `${accountBasePath}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Members', 'Member'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAccountsQuery,
  useGetAccountQuery,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} = accountEndpoints
