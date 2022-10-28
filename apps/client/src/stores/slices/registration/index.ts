import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type RegistrationDetails = {
  firstname: string
  lastname: string
  email: string
  password: string
  passwordConfirmation: string
}

type RegistrationState = RegistrationDetails

const initialState: RegistrationState = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  passwordConfirmation: '',
}

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setDetails: (currentState, action: PayloadAction<RegistrationDetails>) => {
      currentState.firstname = action.payload.firstname
      currentState.lastname = action.payload.lastname
      currentState.email = action.payload.email
      currentState.password = action.payload.password
      currentState.passwordConfirmation = action.payload.passwordConfirmation
    },
  },
})

export const { setDetails } = registrationSlice.actions
export default registrationSlice.reducer
