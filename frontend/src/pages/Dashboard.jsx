import logo from '../assets/logo_tech.png'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const cards = [
    { label: 'Clientes', path: '/clients', color: 'bg-blue-500', icon: '👥' },
    { label: 'Proyectos', path: '/projects', color: 'bg-green-500', icon: '📁' },
    { label: 'Tareas', path: '/tasks', color: 'bg-yellow-500', icon: '✅' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-2">
          <img src={logo} alt="TechSolutions" className="h-8" />
          <span className="text-lg font-bold">TechSolutions</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">Hola, {user?.name} ({user?.role})</span>
          <button onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-1 rounded-lg text-sm font-semibold hover:bg-gray-100 transition">
            Cerrar Sesión
          </button>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto mt-12 px-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-8">Panel de Control</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map(card => (
            <div key={card.path} onClick={() => navigate(card.path)}
              className={`${card.color} text-white rounded-2xl p-6 cursor-pointer hover:opacity-90 transition shadow-md`}>
              <div className="text-4xl mb-3">{card.icon}</div>
              <h3 className="text-xl font-bold">{card.label}</h3>
              <p className="text-sm mt-1 opacity-80">Gestionar {card.label.toLowerCase()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}