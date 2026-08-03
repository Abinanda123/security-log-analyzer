import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.tsx'
import type { ReactNode } from 'react'
import Auth from './pages/Auth.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Logs from './pages/Logs.tsx'
import Threats from './pages/Threats.tsx'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to='/auth' />
}

function App() {
  return (
    <Routes>
      <Route path='/auth' element={<Auth />} />
      <Route path='/' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path='/logs' element={<ProtectedRoute><Logs /></ProtectedRoute>} />
      <Route path='/threats' element={<ProtectedRoute><Threats /></ProtectedRoute>} />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  )
}

export default App