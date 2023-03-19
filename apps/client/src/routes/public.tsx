import { AuthLayout, MainLayout, Spinner } from '@/components'
import {
  ForgotPasswordPage,
  InvitationPage,
  LoginPage,
  RegistrationPage,
  ResetPasswordPage,
} from '@/features/auth'
import { SubdomainPage, SubdomainNotFoundPage, useCheckSubdomainQuery } from '@/features/subdomain'
import { setOrganisation } from '@/stores/slices/organisation'
import { RootState } from '@/stores/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

const Loader = () => {
  return (
    <div className="min-h-full grid place-content-center">
      <Spinner className="text-purple-90 w-12 h-12 stroke-[10px]" />
    </div>
  )
}

export const PublicRoutes = (): JSX.Element => {
  const location = useLocation()
  const navigate = useNavigate()
  const disptach = useDispatch()

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  const subdomain = window?.location.host?.split('.')?.[0]

  const { data, isLoading: isCheckingSubdomain } = useCheckSubdomainQuery({ subdomain })

  useEffect(() => {
    if (location.pathname !== '/register') {
      if (data?.exists) {
        disptach(setOrganisation({ ...data.organisation }))

        if (
          location.pathname !== '/invitation' &&
          location.pathname !== '/forgot-password' &&
          location.pathname !== '/reset-password'
        ) {
          navigate(data?.exists ? '/login' : '/', { replace: true })
        }
      }
    }
  }, [data?.exists, location?.pathname])

  if (isCheckingSubdomain) {
    return <Loader />
  }

  if (
    !data?.exists &&
    subdomain !== import.meta.env.VITE_ARKORA_STATIC_HOSTNAME &&
    subdomain !== 'arkora'
  ) {
    return <SubdomainNotFoundPage />
  }

  if (isAuthenticated) {
    const to = location?.state?.from?.pathname ?? '/timer'
    return <Navigate to={to} replace />
  }

  if (
    location.pathname === '/register' ||
    location.pathname === '/invitation' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/reset-password'
  ) {
    return <MainLayout />
  }

  return <AuthLayout />
}

export const publicRoutes = [
  {
    element: <PublicRoutes />,
    children: [
      {
        path: '/',
        element: <SubdomainPage />,
      },
      {
        path: '/register',
        element: <RegistrationPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: '/invitation',
        element: <InvitationPage />,
      },
    ],
  },
]
