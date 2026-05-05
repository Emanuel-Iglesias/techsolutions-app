import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts'
import api from '../../api/axios'
import logo from '../../assets/logo_tech.png'

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6']

export default function Analytics() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [clients, setClients] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/projects').then(res => setProjects(res.data))
    api.get('/tasks').then(res => setTasks(res.data))
    api.get('/clients').then(res => setClients(res.data))
  }, [])

  const projectProgress = projects.map(p => {
    const projectTasks = tasks.filter(t => t.projectId === p.id)
    const completed = projectTasks.filter(t => t.status === 'completed').length
    const total = projectTasks.length
    return {
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      avance: total > 0 ? Math.round((completed / total) * 100) : 0,
      total,
      completed
    }
  })

  const tasksByStatus = [
    { name: 'Pendiente', value: tasks.filter(t => t.status === 'pending').length },
    { name: 'En progreso', value: tasks.filter(t => t.status === 'in_progress').length },
    { name: 'Completado', value: tasks.filter(t => t.status === 'completed').length },
  ]

  const tasksByPriority = [
    { name: 'Alta', value: tasks.filter(t => t.priority === 'HIGH').length },
    { name: 'Media', value: tasks.filter(t => t.priority === 'MEDIUM').length },
    { name: 'Baja', value: tasks.filter(t => t.priority === 'LOW').length },
  ]

  const projectsByStatus = [
    { name: 'Activo', value: projects.filter(p => p.status === 'active').length },
    { name: 'Completado', value: projects.filter(p => p.status === 'completed').length },
    { name: 'Pausado', value: projects.filter(p => p.status === 'paused').length },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-2">
          <img src={logo} alt="TechSolutions" className="h-8" />
          <span className="text-lg font-bold">TechSolutions</span>
        </div>
        <button onClick={() => navigate('/dashboard')} className="bg-white text-blue-600 px-4 py-1 rounded-lg text-sm font-semibold hover:bg-gray-100 transition">← Dashboard</button>
      </nav>

      <div className="max-w-6xl mx-auto mt-8 px-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-700">Analíticas</h2>

        {/* Tarjetas resumen */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Clientes', value: clients.length, color: 'bg-blue-500' },
            { label: 'Proyectos', value: projects.length, color: 'bg-green-500' },
            { label: 'Tareas', value: tasks.length, color: 'bg-yellow-500' },
            { label: 'Completadas', value: tasks.filter(t => t.status === 'completed').length, color: 'bg-purple-500' },
          ].map(card => (
            <div key={card.label} className={`${card.color} text-white rounded-2xl p-4 shadow`}>
              <p className="text-sm opacity-80">{card.label}</p>
              <p className="text-3xl font-bold mt-1">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Avance por proyecto */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Avance por Proyecto (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(val) => `${val}%`} />
              <Bar dataKey="avance" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Tareas por estado */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Tareas por Estado</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={tasksByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {tasksByStatus.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tareas por prioridad */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Tareas por Prioridad</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={tasksByPriority} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {tasksByPriority.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Proyectos por estado */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Proyectos por Estado</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={projectsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {projectsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}