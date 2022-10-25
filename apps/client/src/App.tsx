import { ReactNode } from 'react'

type AppProps = {
  children: ReactNode
}

const App = ({ children }: AppProps): JSX.Element => {
  return <div className="relative min-h-full h-full">{children}</div>
}

export default App
