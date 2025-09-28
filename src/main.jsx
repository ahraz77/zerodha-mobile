import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome.jsx'
import LoginPage from './pages/Login.jsx'
import SignupPage from './pages/signup.jsx'
import ConnectedApps from './pages/Connected_Apps.jsx'
import LicensesPage from './pages/license.jsx'
import InviteFriends from './pages/invite_frds.jsx'
import FundsPage from './pages/Funds.jsx'
import SettingsPage from './pages/settings.jsx'
import PortfolioPage from './pages/portfolio.jsx'
import PWAInstaller from './components/PWAInstaller.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <PWAInstaller />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/connected-apps" element={<ConnectedApps />} />
        <Route path="/licenses" element={<LicensesPage />} />
        <Route path="/invite-friends" element={<InviteFriends />} />
        <Route path="/funds" element={<FundsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)