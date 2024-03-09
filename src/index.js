import React from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './AppContext'

const root = createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter basename='fishforhelp'>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_SSO_ID}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
)
