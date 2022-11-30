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

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl(),
  credentials: 'include',
  prepareHeaders: prepareHeaders,
})

const appApi = createApi({
  reducerPath: 'arkoraApi',
  tagTypes: ['Project', 'Projects'],
  baseQuery,

  endpoints: () => ({}),
})

export default appApi
