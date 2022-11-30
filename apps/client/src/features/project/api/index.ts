import appApi from 'api'
import { CreateProjectRequest } from './types/requests'
import { CreateProjectResponse, GetProjectsResponse } from './types/response'

const projectsBasePath = '/projects'

const projectEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<GetProjectsResponse, void>({
      query: () => projectsBasePath,
      providesTags: ['Projects'],
    }),
    createProject: build.mutation<CreateProjectResponse, CreateProjectRequest>({
      query: (body) => ({
        url: projectsBasePath,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Projects'],
    }),
  }),
  overrideExisting: false,
})

export const { useGetProjectsQuery, useCreateProjectMutation } = projectEndpoints
