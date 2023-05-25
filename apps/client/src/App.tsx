import { ReactNode } from 'react'
import { Spinner } from './components'
import { useGetSessionQuery } from './features/auth'

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
  const { isLoading } = useGetSessionQuery()

  if (isLoading) {
    return <Loader />
  }

  return <div className="relative min-h-full h-full">{children}</div>
}

export default App
