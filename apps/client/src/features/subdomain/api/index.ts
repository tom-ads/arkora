import appApi from 'api'
import { CheckSubdomainRequest } from './types/requests'
import { CheckSubdomainResponse } from './types/responses'

const subdomainBasePath = '/api/v1/subdomain'

const subdomainEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    checkSubdomain: build.query<CheckSubdomainResponse, CheckSubdomainRequest>({
      query: ({ subdomain }) => ({
        url: subdomainBasePath,
        params: {
          // Default to empty string to prevent RTK from removing the param
          subdomain: subdomain ?? '',
        },
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useCheckSubdomainQuery, useLazyCheckSubdomainQuery } = subdomainEndpoints
