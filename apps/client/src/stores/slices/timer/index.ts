import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { string } from 'zod'

interface Timesheet {
  selectedDay: string
  startDate: string | null
  endDate: string | null
}

interface TimerState {
  isTracking: boolean
  timesheet: Timesheet
}

const initialState: TimerState = {
  isTracking: false,
  timesheet: {
    selectedDay: DateTime.now().toISODate(),
    startDate: DateTime.now().startOf('week').toISODate(),
    endDate: DateTime.now().endOf('week').toISODate(),
  },
}

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTimer: (currentState) => {
      currentState.isTracking = true
    },

    endTimer: (currentState) => {
      currentState.isTracking = false
    },

    setTimesheetPeriod: (
      currentState,
      action: PayloadAction<Pick<Timesheet, 'startDate' | 'endDate'>>,
    ) => {
      currentState.timesheet.startDate = action.payload.startDate
      currentState.timesheet.endDate = action.payload.endDate
    },

    setSelectedDay: (currentState, action: PayloadAction<Pick<Timesheet, 'selectedDay'>>) => {
      currentState.timesheet.selectedDay = action.payload.selectedDay
    },
  },
})

export const { startTimer, endTimer, setTimesheetPeriod, setSelectedDay } = timerSlice.actions
export default timerSlice.reducer
