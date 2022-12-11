import { Route, Routes } from 'react-router-dom'
import { TimerPage } from '../pages'

export const TimerRoute = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<TimerPage />} />
    </Routes>
  )
}
