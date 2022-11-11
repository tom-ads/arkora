import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import appApi from 'api'
import RegistrationReducer from './slices/registration'
import OrganisationReducer from './slices/organisation'

const appReducers = {
  registration: RegistrationReducer,
  organisation: OrganisationReducer,
}

export const store = configureStore({
  reducer: {
    ...appReducers,
    [appApi.reducerPath]: appApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(appApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>

setupListeners(store.dispatch)
