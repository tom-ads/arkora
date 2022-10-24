import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import AppRouter from './routes'

import './styling/index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App>
        <AppRouter />
      </App>
    </BrowserRouter>
  </React.StrictMode>,
)
