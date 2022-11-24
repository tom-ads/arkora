import appApi from 'api'
import { GetClientsResponse } from './types/response'

const clientBasePath = '/projects'

const clientEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    getClients: build.query<GetClientsResponse, void>({
      query: () => clientBasePath,
    }),
  }),
  overrideExisting: false,
})

export const { useGetClientsQuery } = clientEndpoints
