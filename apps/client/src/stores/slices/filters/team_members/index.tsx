import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import UserRole from '@/enums/UserRole'

export type TeamMemberStatus = 'INVITE_ACCEPTED' | 'INVITE_PENDING'

interface TeamMemberFilterState {
  search: string | null
  role: UserRole | null
  status: TeamMemberStatus | null
}

const initialState: TeamMemberFilterState = {
  search: null,
  role: null,
  status: null,
}

const TeamMemberFilters = createSlice({
  name: 'teamMemberFilters',
  initialState,
  reducers: {
    setFilters: (currentState, action: PayloadAction<TeamMemberFilterState>) => {
      currentState = Object.assign(currentState, action.payload)
    },

    clearFilters: (currentState) => {
      currentState.search = null
      currentState.role = null
      currentState.status = null
    },
  },
})

export const { setFilters, clearFilters } = TeamMemberFilters.actions
export default TeamMemberFilters.reducer
