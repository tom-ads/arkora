import { Route, Routes } from 'react-router-dom'
import { BudgetPage } from '../pages/budget'

export const BudgetRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path=":budgetId" element={<BudgetPage />} />
    </Routes>
  )
}
