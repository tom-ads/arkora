import appApi from 'api'
import {
  VerifyDetailsRequest,
  VerifyOrganisationRequest,
  VerifyInvitationRequest,
  RegisterRequest,
  LoginRequest,
} from './types/requests'
import {
  RegisterResponse,
  LoginResponse,
  SessionResponse,
  VerifyInvitationResponse,
} from './types/response'

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

    verifyInvitation: build.mutation<VerifyInvitationResponse, VerifyInvitationRequest>({
      query: (body) => ({
        url: `${authBasePath}/verifyInvitation`,
        method: 'POST',
        body,
      }),
    }),

    register: build.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: `${authBasePath}/register`,
        method: 'POST',
        body,
      }),
    }),

    login: build.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: `${authBasePath}/login`,
        method: 'POST',
        body,
      }),
    }),

    getSession: build.query<SessionResponse, void>({
      query: () => `${authBasePath}/session `,
    }),
  }),
  overrideExisting: false,
})

export const {
  useVerifyDetailsMutation,
  useVerifyOrganisationMutation,
  useVerifyInvitationMutation,
  useRegisterMutation,
  useLoginMutation,
  useGetSessionQuery,
} = authEndpoints
