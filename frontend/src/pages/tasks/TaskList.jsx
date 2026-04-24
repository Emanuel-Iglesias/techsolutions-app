import logo from '../../assets/logo_tech.png'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function TaskList() {
  const [tasks, setTasks] = useState([])
  const navigate = useNavigate()

  const fetchTasks = async () => {
    const res = await api.get('/tasks')
    setTasks(res.data)
  }

  useEffect(() => { fetchTasks() }, [])

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar tarea?')) return
    await api.delete(`/tasks/${id}`)
    fetchTasks()
  }

  const priorityStyle = {
    HIGH: 'bg-red-100 text-red-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    LOW: 'bg-green-100 text-green-700'
  }

  const priorityLabel = { HIGH: 'Alta', MEDIUM: 'Media', LOW: 'Baja' }

  const statusStyle = {
    pending: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700'
  }

  const statusLabel = { pending: 'Pendiente', in_progress: 'En progreso', completed: 'Completado' }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-2">
          <img src={logo} alt="TechSolutions" className="h-8" />
          <span className="text-lg font-bold">TechSolutions</span>
        </div>
        <button onClick={() => navigate('/dashboard')} className="bg-white text-blue-600 px-4 py-1 rounded-lg text-sm font-semibold hover:bg-gray-100 transition">← Dashboard</button>
      </nav>
      <div className="max-w-6xl mx-auto mt-8 px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">Tareas</h2>
          <button onClick={() => navigate('/tasks/new')}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-semibold">
            + Nueva Tarea
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Título</th>
                <th className="px-6 py-3 text-left">Proyecto</th>
                <th className="px-6 py-3 text-left">Responsable</th>
                <th className="px-6 py-3 text-left">Prioridad</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{t.title}</td>
                  <td className="px-6 py-4 text-gray-600">{t.project?.name}</td>
                  <td className="px-6 py-4 text-gray-600">{t.user?.name || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityStyle[t.priority]}`}>
                      {priorityLabel[t.priority]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyle[t.status]}`}>
                      {statusLabel[t.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => navigate(`/tasks/edit/${t.id}`)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded-lg text-xs hover:bg-yellow-500 transition">Editar</button>
                    <button onClick={() => handleDelete(t.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tasks.length === 0 && <p className="text-center text-gray-400 py-8">No hay tareas registradas</p>}
        </div>
      </div>
    </div>
  )
}