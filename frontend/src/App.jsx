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
import UserList from './pages/admin/UserList'
import UserForm from './pages/admin/UserForm'
import SessionLogs from './pages/admin/SessionLogs'
import ChangeLog from './pages/admin/ChangeLog'
import ProjectDetail from './pages/projects/ProjectDetail'
import Analytics from './pages/admin/Analytics'
import History from './pages/admin/History'

const PrivateRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

const AdminRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (user.role !== 'ADMIN') return <Navigate to="/dashboard" />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/clients" element={<PrivateRoute><ClientList /></PrivateRoute>} />
      <Route path="/clients/new" element={<AdminRoute><ClientForm /></AdminRoute>} />
      <Route path="/clients/edit/:id" element={<AdminRoute><ClientForm /></AdminRoute>} />
      <Route path="/projects" element={<PrivateRoute><ProjectList /></PrivateRoute>} />
      <Route path="/projects/new" element={<AdminRoute><ProjectForm /></AdminRoute>} />
      <Route path="/projects/edit/:id" element={<AdminRoute><ProjectForm /></AdminRoute>} />
      <Route path="/tasks" element={<PrivateRoute><TaskList /></PrivateRoute>} />
      <Route path="/tasks/new" element={<AdminRoute><TaskForm /></AdminRoute>} />
      <Route path="/tasks/edit/:id" element={<AdminRoute><TaskForm /></AdminRoute>} />
      <Route path="/users" element={<AdminRoute><UserList /></AdminRoute>} />
      <Route path="/users/new" element={<AdminRoute><UserForm /></AdminRoute>} />
      <Route path="/users/edit/:id" element={<AdminRoute><UserForm /></AdminRoute>} />
      <Route path="/sessions" element={<AdminRoute><SessionLogs /></AdminRoute>} />
      <Route path="/changelog" element={<AdminRoute><ChangeLog /></AdminRoute>} />
      <Route path="/projects/:id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
      <Route path="/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
      <Route path="/history" element={<AdminRoute><History /></AdminRoute>} />
    </Routes>
  )
}