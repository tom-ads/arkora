import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Organisation } from '@/types'

const initialState: Partial<Organisation> = {}

const organisationState = createSlice({
  name: 'organisation',
  initialState,
  reducers: {
    setOrganisation: (currentState, action: PayloadAction<Partial<Organisation>>) => {
      currentState.id = action.payload.id
      currentState.name = action.payload.name
      currentState.subdomain = action.payload.subdomain
      currentState.openingTime = action.payload.openingTime
      currentState.closingTime = action.payload.closingTime
      currentState.breakDuration = action.payload.breakDuration
      currentState.currency = action.payload.currency
      currentState.defaultRate = action.payload.defaultRate
      currentState.businessDays = action.payload.businessDays
      currentState.commonTasks = action.payload.commonTasks
      currentState.createdAt = action.payload.createdAt
    },

    clearOrganisation: (currentState) => {
      currentState.id = undefined
      currentState.name = undefined
      currentState.subdomain = undefined
      currentState.openingTime = undefined
      currentState.closingTime = undefined
      currentState.breakDuration = undefined
      currentState.businessDays = []
      currentState.commonTasks = []
      currentState.currency = {
        code: 'GBP',
        name: 'Great Brtish Pounds',
        symbol: '£',
      }
      currentState.defaultRate = undefined
      currentState.createdAt = undefined
    },
  },
})

export const { setOrganisation } = organisationState.actions
export default organisationState.reducer
