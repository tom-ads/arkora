import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import TimeEntry from '@/types/models/TimeEntry'

interface TimesheetState {
  selectedDay: string
  startDate: string | null
  endDate: string | null
}

interface TimerState {
  isTracking: boolean
  timeEntry: TimeEntry | null
  timesheet: TimesheetState
}

const initialState: TimerState = {
  isTracking: false,
  timeEntry: null,
  timesheet: {
    selectedDay: DateTime.now().toISODate()!,
    startDate: DateTime.now().startOf('week').toISODate()!,
    endDate: DateTime.now().endOf('week').toISODate()!,
  },
}

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTracking: (currentState, action: PayloadAction<TimeEntry>) => {
      currentState.isTracking = true
      currentState.timeEntry = action.payload
    },

    setDurationMinutes: (currentState, action: PayloadAction<number>) => {
      if (currentState.timeEntry) {
        currentState.timeEntry.durationMinutes = action.payload
      }
    },

    stopTracking: (currentState) => {
      currentState.isTracking = false
      currentState.timeEntry = null
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

export const {
  startTracking,
  stopTracking,
  setDurationMinutes,
  setTimesheetPeriod,
  setSelectedDay,
} = timerSlice.actions
export default timerSlice.reducer
