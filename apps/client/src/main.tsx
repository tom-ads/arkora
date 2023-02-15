import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import AppRouter from './routes'
import { store } from './stores/store'
import { NotifierContextProvider } from 'react-headless-notifier'

import 'react-tooltip/dist/react-tooltip.css'

import './styling/index.css'

const notifierConfig = {
  max: null,
  duration: 5000,
  position: 'topRight',
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <NotifierContextProvider config={notifierConfig}>
      <BrowserRouter>
        <Provider store={store}>
          <App>
            <AppRouter />
          </App>
        </Provider>
      </BrowserRouter>
    </NotifierContextProvider>
  </React.StrictMode>,
)
