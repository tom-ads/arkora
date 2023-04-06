import { Organisation } from '@/types'
import appApi from 'api'
import { UpdateOrganisationRequest } from './types/requests'

const organisationBasePath = '/organisations'

const organisationEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    updateOrganisation: build.mutation<Organisation, UpdateOrganisationRequest>({
      query: ({ id, ...body }) => ({
        url: `${organisationBasePath}/${id}`,
        method: 'PUT',
        body,
      }),
    }),

    deleteOrganisation: build.mutation<void, number>({
      query: (id) => ({
        url: `${organisationBasePath}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useUpdateOrganisationMutation, useDeleteOrganisationMutation } =
  organisationEndpoints
