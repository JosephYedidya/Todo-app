
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

import Dashboard from './pages/dashboard/Dashboard'
import Tasks from './pages/dashboard/Tasks'
import Profile from './pages/dashboard/Profile'

import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Route d'accueil */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes protégées */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Route inconnue */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
