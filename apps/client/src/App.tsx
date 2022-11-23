import { ReactNode, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Spinner } from './components'
import { useSessionQuery } from './features/auth'
import { setAuth } from './stores/slices/auth'
import { setOrganisation } from './stores/slices/organisation'
import { RootState } from './stores/store'

const Loader = () => {
  return (
    <div className="min-h-full grid place-content-center">
      <Spinner className="text-purple-90 w-12 h-12 stroke-[10px]" />
    </div>
  )
}

type AppProps = {
  children: ReactNode
}

const App = ({ children }: AppProps): JSX.Element => {
  const dispatch = useDispatch()

  const { data: authResponse, isLoading } = useSessionQuery()

  useEffect(() => {
    if (authResponse) {
      dispatch(setAuth(authResponse.user))
      dispatch(setOrganisation(authResponse.organisation))
    }
  }, [authResponse])

  if (isLoading) {
    return <Loader />
  }

  return <div className="relative min-h-full h-full">{children}</div>
}

export default App
