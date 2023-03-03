import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type ProjectTab = 'budgets' | 'entries' | 'team'

interface ProjectFilterState {
  tab: ProjectTab
}

const initialState: ProjectFilterState = {
  tab: 'budgets',
}

const ProjectFilters = createSlice({
  name: 'projectFilters',
  initialState,
  reducers: {
    setFilters: (currentState, action: PayloadAction<ProjectFilterState>) => {
      currentState = Object.assign(currentState, action.payload)
    },

    clearFilters: (currentState) => {
      currentState.tab = 'budgets'
    },
  },
})

export const { setFilters, clearFilters } = ProjectFilters.actions
export default ProjectFilters.reducer
