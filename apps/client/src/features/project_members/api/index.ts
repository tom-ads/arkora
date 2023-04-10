import { User } from '@/types'
import appApi from 'api'
import { CreateProjectMembersRequest, GetProjectMembersRequest } from './types/requests'
import DeleteProjectMemberRequest from './types/requests/delete_member'

const projectMembersBasePath = '/projects'

const budgetEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    getProjectMembers: build.query<User[], GetProjectMembersRequest>({
      query: ({ projectId, ...params }) => ({
        url: `${projectMembersBasePath}/${projectId}/members`,
        params: {
          ...(params.search && { search: params.search }),
        },
      }),
      providesTags: ['ProjectMembers'],
    }),

    createProjectMembers: build.mutation<User[], CreateProjectMembersRequest>({
      query: ({ projectId, ...body }) => ({
        url: `${projectMembersBasePath}/${projectId}/members`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ProjectMembers'],
    }),

    deleteProjectMember: build.mutation<void, DeleteProjectMemberRequest>({
      query: ({ projectId, memberId }) => ({
        url: `${projectMembersBasePath}/${projectId}/members/${memberId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProjectMembers'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetProjectMembersQuery,
  useCreateProjectMembersMutation,
  useDeleteProjectMemberMutation,
} = budgetEndpoints
