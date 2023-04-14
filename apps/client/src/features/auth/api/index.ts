import { User } from '@/types'
import appApi from 'api'
import {
  VerifyDetailsRequest,
  VerifyOrganisationRequest,
  VerifyInvitationRequest,
  RegisterRequest,
  LoginRequest,
  ResendInvitationRequest,
  InviteMembersRequest,
  ChangePasswordRequest,
  ResetPasswordRequest,
} from './types/requests'
import {
  RegisterResponse,
  LoginResponse,
  SessionResponse,
  VerifyInvitationResponse,
} from './types/response'

const authBasePath = '/api/v1/auth'

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
        url: `${authBasePath}/invitations/verify`,
        method: 'POST',
        body,
      }),
    }),

    resendInvitation: build.mutation<void, ResendInvitationRequest>({
      query: (body) => ({
        url: `${authBasePath}/invitations/resend`,
        method: 'POST',
        body,
      }),
    }),

    inviteMembers: build.mutation<void, InviteMembersRequest>({
      query: (body) => ({
        url: `${authBasePath}/invitations`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Members'],
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

    logout: build.mutation<void, void>({
      query: () => ({
        url: `${authBasePath}/logout`,
        method: 'POST',
      }),
    }),

    changePassword: build.mutation<User, ChangePasswordRequest>({
      query: (body) => ({
        url: `${authBasePath}/change-password`,
        method: 'POST',
        body,
      }),
    }),

    forgotPassword: build.mutation<void, string>({
      query: (email) => ({
        url: `${authBasePath}/forgot-password`,
        method: 'POST',
        body: { email },
      }),
    }),

    resetPassword: build.mutation<void, ResetPasswordRequest>({
      query: (body) => ({
        url: `${authBasePath}/reset-password`,
        method: 'POST',
        body: {
          user_id: body.userId,
          token: body.token,
          password: body.password,
          password_confirmation: body.passwordConfirmation,
        },
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
  useResendInvitationMutation,
  useInviteMembersMutation,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetSessionQuery,
} = authEndpoints
