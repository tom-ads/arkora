import appApi from 'api'
import { GetAccountsRequest } from './types/requests'
import { GetAccountsResponse } from './types/response'

const accountBasePath = '/accounts'

const accountEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    getAccounts: build.query<GetAccountsResponse, GetAccountsRequest>({
      query: (params) => ({
        url: accountBasePath,
        params,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetAccountsQuery } = accountEndpoints
