import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import AppRouter from './routes'
import { store } from './stores/store'

import './styling/index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App>
          <AppRouter />
        </App>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
