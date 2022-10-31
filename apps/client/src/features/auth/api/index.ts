import appApi from 'api'
import { VerifyDetailsRequest } from './types'
import VerifyOrganisationRequest from './types/requests/verify_organisation'

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
    verifyOrganisation: build.mutation<void, VerifyOrganisationRequest>({
      query: (body) => ({
        url: `${authBasePath}/register/organisation`,
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useVerifyDetailsMutation, useVerifyOrganisationMutation } = authEndpoints
