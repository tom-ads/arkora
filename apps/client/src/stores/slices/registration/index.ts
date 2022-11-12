import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { WeekDay } from '@/enums/WeekDay'
import { CurrencyCode } from '@/types/CurrencyCode'
import { RegistrationSteps, SelectedRole } from '@/features/auth'

interface RegisterMisc {
  step: RegistrationSteps
}

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
  misc: RegisterMisc
}

const initialState: RegistrationState = JSON.parse(
  localStorage.getItem('registration') ??
    `{
  "misc": {
    "step": "details"
  },
  "details": {
    "firstname": "",
    "lastname": "",
    "email": "",
    "password": ""
  },
  "organisation": {
    "name": "",
    "subdomain": "",
    "workDays": [],
    "openingTime": "",
    "closingTime": "",
    "currency": {
      "value": "GBP",
      "children": "British Pound Sterling"
    },
    "hourlyRate": ""
  },
  "team": []
}`,
)

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setStep: (currentState, action: PayloadAction<Pick<RegisterMisc, 'step'>>) => {
      currentState.misc.step = action.payload.step

      localStorage.setItem('registration', JSON.stringify(currentState))
    },

    setDetails: (currentState, action: PayloadAction<RegisterDetails>) => {
      currentState.details.firstname = action.payload.firstname
      currentState.details.lastname = action.payload.lastname
      currentState.details.email = action.payload.email
      currentState.details.password = action.payload.password

      localStorage.setItem('registration', JSON.stringify(currentState))
    },

    setOrganisation: (currentState, action: PayloadAction<RegisterOrganisation>) => {
      currentState.organisation.name = action.payload.name
      currentState.organisation.subdomain = action.payload.subdomain
      currentState.organisation.workDays = action.payload.workDays
      currentState.organisation.openingTime = action.payload.openingTime
      currentState.organisation.closingTime = action.payload.closingTime
      currentState.organisation.currency = action.payload.currency
      currentState.organisation.hourlyRate = action.payload.hourlyRate

      localStorage.setItem('registration', JSON.stringify(currentState))
    },

    setTeam: (currentState, action: PayloadAction<RegisterTeamMember[]>) => {
      currentState.team = action.payload

      localStorage.setItem('registration', JSON.stringify(currentState))
    },

    clearRegistration: (currentState) => {
      currentState.details = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
      }
      currentState.misc = {
        step: 'details',
      }
      currentState.organisation = {
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
      }
      currentState.team = []

      localStorage.removeItem('registration')
    },
  },
})

export const { setStep, setDetails, setOrganisation, setTeam, clearRegistration } =
  registrationSlice.actions
export default registrationSlice.reducer
