import { useCallback, useMemo } from 'react'
import { useAuth } from './useAuth'
import { organisationPolicies } from '@/features/organisation'
import { projectPolicy } from '@/features/project'

export const useAuthorization = () => {
  const { authUser } = useAuth()

  const appPolicies = useMemo(
    () => ({ ...organisationPolicies, ...projectPolicy }),
    [organisationPolicies, projectPolicy],
  )

  const checkPermission = useCallback(
    (policy: keyof typeof appPolicies) => {
      let hasAccess = false
      if (authUser) {
        hasAccess = appPolicies[policy]?.(authUser)
      }

      return hasAccess
    },
    [authUser, appPolicies],
  )

  return { checkPermission }
}
