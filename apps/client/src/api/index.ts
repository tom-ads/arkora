import { transformRequest, transformResponse } from '@/helpers/transform'
import { clearAuth } from '@/stores/slices/auth'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

/* 
  Certain web browsers treat SameSite: Strict and subdomains as
  cross-origins when using localhost. So, we need to set the subdoamin
  into the request URL.
*/
const baseUrl = (): string => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_ARKORA_API_BASE_URL
  }

  const url = new URL(import.meta.env.VITE_ARKORA_API_BASE_URL)
  url.hostname = window.location.hostname
  return url.toString()
}

const prepareHeaders = (headers: Headers) => {
  const xsrfCookie = document.cookie.match(new RegExp('(XSRF-TOKEN)=([^;]*)'))
  if (xsrfCookie) {
    headers.set('X-XSRF-TOKEN', decodeURIComponent(xsrfCookie[2]))
  }
  return headers
}

const rootQuery = fetchBaseQuery({
  baseUrl: baseUrl(),
  credentials: 'include',
  prepareHeaders: prepareHeaders,
})

const baseQueryInterceptor: typeof rootQuery = async (args, api, extraOptions) => {
  if (typeof args === 'object') {
    if (args?.params) {
      args.params = transformRequest(args.params)
    }

    if (args.body) {
      args.body = transformRequest(args.body)
    }
  }

  const result = await rootQuery(args, api, extraOptions)

  // Logout if response is 401
  if (result.error && result.error?.status === 401 && api.endpoint !== 'getSession') {
    api.dispatch(clearAuth())
  }

  // Recursively transform response result to camelCase
  if (result.data) {
    result.data = transformResponse(result.data)
  }

  return result
}

const appApi = createApi({
  reducerPath: 'arkoraApi',
  tagTypes: [
    'Project',
    'Projects',
    'TimeEntries',
    'TimeEntry',
    'Budgets',
    'Budget',
    'BudgetTasks',
    'BudgetTask',
    'Members',
    'Member',
    'ProjectMembers',
    'ProjectMember',
    'Clients',
    'Client',
  ],
  baseQuery: baseQueryInterceptor,
  endpoints: () => ({}),
})

export default appApi
