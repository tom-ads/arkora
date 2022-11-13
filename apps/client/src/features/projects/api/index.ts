import appApi from 'api'
import { GetProjectsResponse } from './types/response'

const projectsBasePath = '/projects'

const projectEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    projects: build.query<void, GetProjectsResponse>({
      query: () => projectsBasePath,
    }),
  }),
  overrideExisting: false,
})

export const { useProjectsQuery } = projectEndpoints
