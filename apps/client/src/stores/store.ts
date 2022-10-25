import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import appApi from 'api'

export const store = configureStore({
  reducer: {
    [appApi.reducerPath]: appApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(appApi.middleware),
})

setupListeners(store.dispatch)
