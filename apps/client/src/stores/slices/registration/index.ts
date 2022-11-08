import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { WeekDay } from '@/enums/WeekDay'
import { CurrencyCode } from '@/types/CurrencyCode'
import UserRole from '@/enums/UserRole'

interface RegisterDetails {
  firstname: string
  lastname: string
  email: string
  password: string
}

interface RegisterOrganisation {
  name: string
  subdomain: string
  workDays: WeekDay[]
  openingTime: string
  closingTime: string
  currency: {
    value: CurrencyCode
    children: string
  }
  hourlyRate: string
}

interface RegisterTeam {
  team: Array<{
    email: string
    role: UserRole
  }>
}

type RegistrationState = RegisterDetails & RegisterOrganisation & RegisterTeam

const initialState: RegistrationState = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',

  name: '',
  subdomain: '',
  workDays: [],
  openingTime: '',
  closingTime: '',
  currency: {
    value: 'GBP',
    children: 'British Pound Sterling',
  },
  hourlyRate: '',

  team: [],
}

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setDetails: (currentState, action: PayloadAction<RegisterDetails>) => {
      currentState.firstname = action.payload.firstname
      currentState.lastname = action.payload.lastname
      currentState.email = action.payload.email
      currentState.password = action.payload.password
    },

    setOrganisation: (currenctState, action: PayloadAction<RegisterOrganisation>) => {
      currenctState.name = action.payload.name
      currenctState.subdomain = action.payload.subdomain
      currenctState.workDays = action.payload.workDays
      currenctState.openingTime = action.payload.openingTime
      currenctState.closingTime = action.payload.closingTime
      currenctState.currency = action.payload.currency
      currenctState.hourlyRate = action.payload.hourlyRate
    },

    setTeam: (currentState, action: PayloadAction<RegisterTeam>) => {
      currentState.team = action.payload.team
    },
  },
})

export const { setDetails, setOrganisation } = registrationSlice.actions
export default registrationSlice.reducer
