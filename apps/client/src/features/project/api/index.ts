import appApi from 'api'
import { CreateProjectRequest, UpdateProjectRequest } from './types/requests'
import {
  CreateProjectResponse,
  GetProjectInsightsResponse,
  GetProjectResponse,
  GetProjectsResponse,
  UpdateProjectResponse,
} from './types/response'

const projectsBasePath = '/api/v1/projects'

const projectEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    createProject: build.mutation<CreateProjectResponse, CreateProjectRequest>({
      query: (body) => ({
        url: projectsBasePath,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Projects'],
    }),

    getProjects: build.query<GetProjectsResponse, void>({
      query: () => projectsBasePath,
      providesTags: ['Projects'],
    }),

    getProject: build.query<GetProjectResponse, number | string>({
      query: (id) => `${projectsBasePath}/${id}`,
      providesTags: ['Project'],
    }),

    updateProject: build.mutation<UpdateProjectResponse, UpdateProjectRequest>({
      query: ({ id, ...body }) => ({
        url: `${projectsBasePath}/${id}`,
        method: 'PUT',
        body,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedProject } = await queryFulfilled
          dispatch(
            projectEndpoints.util.updateQueryData('getProject', id, (draft) => {
              Object.assign(draft, updatedProject)
            }),
          )
        } catch {
          //
        }
      },
      invalidatesTags: ['Projects', 'Budgets'],
    }),

    deleteProject: build.mutation<void, number>({
      query: (id) => ({
        url: `${projectsBasePath}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Projects', 'Project'],
    }),

    getProjectInsights: build.query<GetProjectInsightsResponse, number | string>({
      query: (id) => `${projectsBasePath}/${id}/insights`,
      providesTags: ['Projects', 'Budget'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetProjectQuery,
  useUpdateProjectMutation,
  useLazyGetProjectQuery,
  useDeleteProjectMutation,
  useGetProjectInsightsQuery,
} = projectEndpoints
