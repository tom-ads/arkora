import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_ARKORA_API_BASE_URL,
})

const appApi = createApi({
  reducerPath: 'arkoraApi',
  baseQuery,
  endpoints: () => ({}),
})

export default appApi
