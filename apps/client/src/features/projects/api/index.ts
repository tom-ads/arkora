import appApi from 'api'
import { GetProjectsResponse } from './types/response'

const projectsBasePath = '/projects'

const projectEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<GetProjectsResponse, void>({
      query: () => projectsBasePath,
    }),
  }),
  overrideExisting: false,
})

export const { useGetProjectsQuery } = projectEndpoints
