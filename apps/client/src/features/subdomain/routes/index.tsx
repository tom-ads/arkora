import { Route, Routes } from 'react-router-dom'
import { SubdomainPage } from '../pages/SubdomainPage'

export const SubdomainRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<SubdomainPage />} />
    </Routes>
  )
}
