import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { WeekDay } from '@/enums/WeekDay'
import { CurrencyCode } from '@/types/CurrencyCode'
import { SelectedRole } from '@/features/auth'

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

interface RegisterTeamMember {
  email: string
  role: SelectedRole
}

interface RegistrationState {
  details: RegisterDetails
  organisation: RegisterOrganisation
  team: RegisterTeamMember[]
}

const initialState: RegistrationState = {
  details: {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  },

  organisation: {
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
  },

  team: [],
}

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setDetails: (currentState, action: PayloadAction<RegisterDetails>) => {
      currentState.details.firstname = action.payload.firstname
      currentState.details.lastname = action.payload.lastname
      currentState.details.email = action.payload.email
      currentState.details.password = action.payload.password
    },

    setOrganisation: (currenctState, action: PayloadAction<RegisterOrganisation>) => {
      currenctState.organisation.name = action.payload.name
      currenctState.organisation.subdomain = action.payload.subdomain
      currenctState.organisation.workDays = action.payload.workDays
      currenctState.organisation.openingTime = action.payload.openingTime
      currenctState.organisation.closingTime = action.payload.closingTime
      currenctState.organisation.currency = action.payload.currency
      currenctState.organisation.hourlyRate = action.payload.hourlyRate
    },

    setTeam: (currentState, action: PayloadAction<RegisterTeamMember[]>) => {
      currentState.team = action.payload
    },

    clearRegistration: (currentState) => {
      currentState = initialState
    },
  },
})

export const { setDetails, setOrganisation, setTeam, clearRegistration } = registrationSlice.actions
export default registrationSlice.reducer
