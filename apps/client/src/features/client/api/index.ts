import Client from '@/types/models/Client'
import appApi from 'api'
import { CreateClientRequest, UpdateClientRequest } from './types/requests'
import { GetClientsResponse } from './types/response'

const clientBasePath = '/clients'

const clientEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    getClients: build.query<GetClientsResponse, void>({
      query: () => clientBasePath,
      providesTags: ['Clients'],
    }),

    getClient: build.query<Client, number>({
      query: (id) => `${clientBasePath}/${id}`,
      providesTags: ['Client'],
    }),

    createClient: build.mutation<Client, CreateClientRequest>({
      query: (body) => ({
        url: clientBasePath,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Clients'],
    }),

    updateClient: build.mutation<Client, UpdateClientRequest>({
      query: ({ id, ...body }) => ({
        url: `${clientBasePath}/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Clients'],
    }),

    deleteClient: build.mutation<void, number>({
      query: (id) => ({
        url: `${clientBasePath}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Clients'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetClientQuery,
} = clientEndpoints
