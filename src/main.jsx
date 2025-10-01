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
import AddFundsPage from './pages/addfunds.jsx'
import SettingsPage from './pages/settings.jsx'
import PortfolioPage from './pages/portfolio.jsx'
import ProfilePage from './pages/profile.jsx'
import WithdrawPage from './pages/withdrawal.jsx'
import CreateGTTScreen from './pages/gtt.jsx'
import Console from './pages/Console.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import { DataProvider } from './context/DataContext.jsx'
import { NavigationProvider } from './context/NavigationContext.jsx'
import PWAInstaller from './components/PWAInstaller.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <NavigationProvider>
        <PWAInstaller />
        <DataProvider>
          <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/connected-apps" element={<ConnectedApps />} />
          <Route path="/licenses" element={<LicensesPage />} />
          <Route path="/invite-friends" element={<InviteFriends />} />
          <Route path="/funds" element={<FundsPage />} />
          <Route path="/addfunds" element={<AddFundsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/withdrawal" element={<WithdrawPage />} />
          <Route path="/gtt" element={<CreateGTTScreen />} />
          <Route path="/console" element={<Console />} />
          <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </DataProvider>
      </NavigationProvider>
    </Router>
  </React.StrictMode>,
)