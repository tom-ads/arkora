import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import AppRouter from './routes'
import { RootState, store } from './stores/store'
import { NotifierContextProvider } from 'react-headless-notifier'

import './styling/index.css'
import { useInterval } from './hooks/useInterval'
import { setDurationMinutes } from './stores/slices/timer'

const notifierConfig = {
  max: null,
  duration: 5000,
  position: 'topRight',
}

export function TimerWrapper({ children }: { children: JSX.Element }) {
  const dispatch = useDispatch()

  const { isTracking, durationMinutes } = useSelector((state: RootState) => ({
    isTracking: state.timer.isTracking,
    durationMinutes: state.timer.timeEntry?.durationMinutes ?? 0,
  }))

  useInterval(() => dispatch(setDurationMinutes(durationMinutes + 1)), isTracking ? 60000 : null)

  return children
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <NotifierContextProvider config={notifierConfig}>
      <BrowserRouter>
        <Provider store={store}>
          <TimerWrapper>
            <App>
              <AppRouter />
            </App>
          </TimerWrapper>
        </Provider>
      </BrowserRouter>
    </NotifierContextProvider>
  </React.StrictMode>,
)
