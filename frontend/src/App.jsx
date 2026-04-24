import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import ClientList from './pages/clients/ClientList'
import ClientForm from './pages/clients/ClientForm'
import ProjectList from './pages/projects/ProjectList'
import ProjectForm from './pages/projects/ProjectForm'
import TaskList from './pages/tasks/TaskList'
import TaskForm from './pages/tasks/TaskForm'

const PrivateRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/clients" element={<PrivateRoute><ClientList /></PrivateRoute>} />
      <Route path="/clients/new" element={<PrivateRoute><ClientForm /></PrivateRoute>} />
      <Route path="/clients/edit/:id" element={<PrivateRoute><ClientForm /></PrivateRoute>} />
      <Route path="/projects" element={<PrivateRoute><ProjectList /></PrivateRoute>} />
      <Route path="/projects/new" element={<PrivateRoute><ProjectForm /></PrivateRoute>} />
      <Route path="/projects/edit/:id" element={<PrivateRoute><ProjectForm /></PrivateRoute>} />
      <Route path="/tasks" element={<PrivateRoute><TaskList /></PrivateRoute>} />
      <Route path="/tasks/new" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
      <Route path="/tasks/edit/:id" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
    </Routes>
  )
}