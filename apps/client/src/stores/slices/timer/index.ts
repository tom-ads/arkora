import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'

interface Timesheet {
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
    startDate: DateTime.now().startOf('week').toISO(),
    endDate: DateTime.now().endOf('week').toISO(),
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
  },
})

export const { startTimer, endTimer, setTimesheetPeriod } = timerSlice.actions
export default timerSlice.reducer
