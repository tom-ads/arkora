import appApi from 'api'
import { GetSubdomainRequest } from './types/requests'

const subdomainBasePath = '/subdomain'

const subdomainEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    verifySubdomain: build.query<void, GetSubdomainRequest>({
      query: ({ subdomain }) => `${subdomainBasePath}/${subdomain}`,
    }),
  }),
  overrideExisting: false,
})

export const { useVerifySubdomainQuery, useLazyVerifySubdomainQuery } = subdomainEndpoints
