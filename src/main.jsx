import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome.jsx'
import LoginPage from './pages/Login.jsx'
import SignupPage from './pages/signup.jsx'
import ConnectedApps from './pages/Connected_Apps.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/connected-apps" element={<ConnectedApps />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)