import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type ProjectTab = 'budgets' | 'entries' | 'team'

export type BillableTimeEntry = 'billable' | 'unbillable'

export type ProjectTimeEntryFilters = {
  billable: BillableTimeEntry | null
}

interface ProjectFilterState {
  tab: ProjectTab
  timeEntry: Partial<ProjectTimeEntryFilters>
}

const initialState: ProjectFilterState = {
  tab: 'budgets',
  timeEntry: {
    billable: null,
  },
}

const ProjectFilters = createSlice({
  name: 'projectFilters',
  initialState,
  reducers: {
    setFilters: (currentState, action: PayloadAction<Partial<ProjectFilterState>>) => {
      currentState = Object.assign(currentState, action.payload)
    },

    resetTimeEntryFilters: (currentState) => {
      currentState.timeEntry.billable = null
    },

    clearFilters: (currentState) => {
      currentState.tab = 'budgets'
    },
  },
})

export const { setFilters, resetTimeEntryFilters, clearFilters } = ProjectFilters.actions
export default ProjectFilters.reducer
