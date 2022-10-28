import appApi from 'api'
import { VerifyDetailsRequest } from './types'

const authBasePath = '/auth'

const authEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    verifyDetails: build.mutation<void, VerifyDetailsRequest>({
      query: (body) => ({
        url: `${authBasePath}/register/details`,
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useVerifyDetailsMutation } = authEndpoints
