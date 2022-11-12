import { User } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  user: Partial<User>
  isAuthenticated: boolean
}

const initialState: Partial<AuthState> = {
  user: undefined,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (currentState, action: PayloadAction<User>) => {
      currentState.isAuthenticated = true
      currentState.user = action.payload
    },

    clearAuth: (currentState) => {
      currentState.isAuthenticated = false
      currentState.user = {
        firstname: undefined,
        lastname: undefined,
        email: undefined,
        role: undefined,
      }
    },
  },
})

export const { setAuth, clearAuth } = authSlice.actions
export default authSlice.reducer
