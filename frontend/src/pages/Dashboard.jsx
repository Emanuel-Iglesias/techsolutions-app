import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Bienvenido, {user?.name}</h1>
      <p>Rol: {user?.role}</p>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate('/clients')}>Clientes</button>
        <button onClick={() => navigate('/projects')}>Proyectos</button>
        <button onClick={() => navigate('/tasks')}>Tareas</button>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </nav>
    </div>
  )
}