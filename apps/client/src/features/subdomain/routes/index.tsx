import { Route, Routes } from 'react-router-dom'
import { SubdomainPage } from '../pages/Subdomain'

export const SubdomainRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<SubdomainPage />} />
    </Routes>
  )
}
