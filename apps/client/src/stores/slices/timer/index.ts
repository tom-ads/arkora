import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import TimeEntry from '@/types/TimeEntry'

interface TimesheetState {
  selectedDay: string
  startDate: string | null
  endDate: string | null
}

interface TimerState {
  isTracking: boolean
  trackedEntry?: TimeEntry
  timesheet: TimesheetState
}

const initialState: TimerState = {
  isTracking: false,
  trackedEntry: undefined,
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
    startTimer: (currentState, action: PayloadAction<TimeEntry>) => {
      currentState.isTracking = true
      currentState.trackedEntry = action.payload
    },

    endTimer: (currentState) => {
      currentState.isTracking = false
      currentState.trackedEntry = undefined
    },

    setTimesheetPeriod: (
      currentState,
      action: PayloadAction<Pick<TimesheetState, 'startDate' | 'endDate'>>,
    ) => {
      currentState.timesheet.startDate = action.payload.startDate
      currentState.timesheet.endDate = action.payload.endDate
    },

    setSelectedDay: (currentState, action: PayloadAction<Pick<TimesheetState, 'selectedDay'>>) => {
      currentState.timesheet.selectedDay = action.payload.selectedDay
    },
  },
})

export const { startTimer, endTimer, setTimesheetPeriod, setSelectedDay } = timerSlice.actions
export default timerSlice.reducer
