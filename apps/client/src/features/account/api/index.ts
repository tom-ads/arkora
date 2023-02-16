import appApi from 'api'
import { GetAccountsRequest } from './types/requests'
import { GetAccountsResponse } from './types/response'

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
        },
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetAccountsQuery } = accountEndpoints
