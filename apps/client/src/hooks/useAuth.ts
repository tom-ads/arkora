import { useLoginMutation, useLogoutMutation } from '@/features/auth'
import { LoginRequest } from '@/features/auth'
import { clearAuth, setAuth } from '@/stores/slices/auth'
import { setOrganisation } from '@/stores/slices/organisation'
import { startTracking } from '@/stores/slices/timer'
import { RootState } from '@/stores/store'
import { User } from '@/types'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export interface UseProcedureState {
  isLoading: boolean
  error: FetchBaseQueryError | SerializedError | null
}

export interface UseAuthProcedures {
  login: (payload: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  clearQuery: () => void
  queryState: UseProcedureState
}

export interface UseAuthReturn extends UseAuthProcedures {
  authUser: User | null
  isAuthenticated: boolean
}

export const useAuth = (): UseAuthReturn => {
  const dispatch = useDispatch()

  const [queryError, setQueryError] = useState<FetchBaseQueryError | SerializedError | null>(null)

  const { authUser, isAuthenticated } = useSelector((state: RootState) => ({
    authUser: state.auth.user ?? null,
    isAuthenticated: state.auth.isAuthenticated ?? false,
  }))

  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation()
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation()

  const login = useCallback(
    async (data: LoginRequest) => {
      await loginMutation(data)
        .unwrap()
        .then((response) => {
          dispatch(setAuth(response.user))
          dispatch(setOrganisation(response.organisation))
          if (response.timer) {
            dispatch(startTracking(response.timer))
          }
        })
        .catch((error) => setQueryError(error))
    },
    [loginMutation],
  )

  const logout = useCallback(async () => {
    await logoutMutation()
      .unwrap()
      .then(() => dispatch(clearAuth()))
      .catch((error) => setQueryError(error))
  }, [logoutMutation])

  const clearQuery = () => {
    setQueryError(null)
  }

  return {
    authUser: authUser as User,
    isAuthenticated,
    logout,
    login,
    clearQuery,
    queryState: {
      isLoading: isLoggingIn || isLoggingOut,
      error: queryError,
    },
  }
}
