import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type BudgetTab = 'tasks' | 'time' | 'members' | 'notes'

interface BudgetFilterState {
  tab: BudgetTab
}

const initialState: BudgetFilterState = {
  tab: 'tasks',
}

const BudgetFilters = createSlice({
  name: 'budgetFilters',
  initialState,
  reducers: {
    setFilters: (currentState, action: PayloadAction<Partial<BudgetFilterState>>) => {
      currentState = Object.assign(currentState, action.payload)
    },

    clearFilters: (currentState) => {
      currentState.tab = 'tasks'
    },
  },
})

export const { setFilters, clearFilters } = BudgetFilters.actions
export default BudgetFilters.reducer
