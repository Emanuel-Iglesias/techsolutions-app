import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo_tech.png'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const roleLabel = { ADMIN: 'Administrador', EMPLOYEE: 'Empleado', CLIENT: 'Cliente' }

  const adminCards = [
    { label: 'Usuarios', path: '/users', color: 'bg-purple-500', icon: '👤' },
    { label: 'Clientes', path: '/clients', color: 'bg-blue-500', icon: '👥' },
    { label: 'Proyectos', path: '/projects', color: 'bg-green-500', icon: '📁' },
    { label: 'Tareas', path: '/tasks', color: 'bg-yellow-500', icon: '✅' },
    { label: 'Sesiones', path: '/sessions', color: 'bg-red-500', icon: '🔐' },
    { label: 'Historial de Cambios', path: '/changelog', color: 'bg-gray-600', icon: '📋' },
    { label: 'Analíticas', path: '/analytics', color: 'bg-indigo-500', icon: '📊' },
    { label: 'Informe General', path: '/report', color: 'bg-red-600', icon: '📑' },
  ]

  const employeeCards = [
    { label: 'Mis Tareas', path: '/tasks', color: 'bg-yellow-500', icon: '✅' },
  ]

  const clientCards = [
    { label: 'Mis Proyectos', path: '/projects', color: 'bg-green-500', icon: '📁' },
    { label: 'Mis Tareas', path: '/tasks', color: 'bg-yellow-500', icon: '✅' },
  ]

  const cards = user?.role === 'ADMIN' ? adminCards : user?.role === 'EMPLOYEE' ? employeeCards : clientCards

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-4 sm:px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-2">
          <img src={logo} alt="TechSolutions" className="h-8" />
          <span className="text-lg font-bold hidden sm:block">TechSolutions</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-xs sm:text-sm">Hola, {user?.name}</span>
          <button onClick={handleLogout}
            className="bg-white text-blue-600 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-100 transition">
            Cerrar Sesión
          </button>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto mt-12 px-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-8">Panel de Control</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {cards.map(card => (
            <div key={card.path} onClick={() => navigate(card.path)}
              className={`${card.color} text-white rounded-2xl p-4 sm:p-6 cursor-pointer hover:opacity-90 transition shadow-md`}>
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{card.icon}</div>
              <h3 className="text-base sm:text-xl font-bold">{card.label}</h3>
              <p className="text-xs sm:text-sm mt-1 opacity-80 hidden sm:block">Gestionar {card.label.toLowerCase()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}