import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import appApi from 'api'
import AuthReducer from './slices/auth'
import RegistrationReducer from './slices/registration'
import OrganisationReducer from './slices/organisation'
import TimerReducer from './slices/timer'
import TeamMemberFiltersReducer from './slices/filters/team_members'
import ProjectFiltersReducer from './slices/filters/project'

const appReducers = {
  auth: AuthReducer,
  registration: RegistrationReducer,
  organisation: OrganisationReducer,
  timer: TimerReducer,

  // Filters
  teamMemberFilters: TeamMemberFiltersReducer,
  projectFilters: ProjectFiltersReducer,
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
