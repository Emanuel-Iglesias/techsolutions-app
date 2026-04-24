import logo from '../../assets/logo_tech.png'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'

export default function TaskForm() {
  const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM', status: 'pending', projectId: '', userId: '' })
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/projects').then(res => setProjects(res.data))
    api.get('/auth/users').then(res => setUsers(res.data)).catch(() => {})
    if (id) {
      api.get(`/tasks/${id}`).then(res => {
        const t = res.data
        setForm({
          title: t.title,
          description: t.description || '',
          priority: t.priority,
          status: t.status,
          projectId: t.projectId,
          userId: t.userId || ''
        })
      })
    }
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (id) {
      await api.put(`/tasks/${id}`, form)
    } else {
      await api.post('/tasks', form)
    }
    navigate('/tasks')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-2">
          <img src={logo} alt="TechSolutions" className="h-8" />
          <span className="text-lg font-bold">TechSolutions</span>
        </div>
        <button onClick={() => navigate('/tasks')} className="bg-white text-blue-600 px-4 py-1 rounded-lg text-sm font-semibold hover:bg-gray-100 transition">← Tareas</button>
      </nav>
      <div className="max-w-lg mx-auto mt-10 px-6">
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">{id ? 'Editar' : 'Nueva'} Tarea</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Título</label>
              <input name="title" value={form.title} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Descripción</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Prioridad</label>
                <select name="priority" value={form.priority} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="LOW">Baja</option>
                  <option value="MEDIUM">Media</option>
                  <option value="HIGH">Alta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Estado</label>
                <select name="status" value={form.status} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En progreso</option>
                  <option value="completed">Completado</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Proyecto</label>
              <select name="projectId" value={form.projectId} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">Seleccionar proyecto</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Responsable (opcional)</label>
              <select name="userId" value={form.userId} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">Sin asignar</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit"
                className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition font-semibold">
                {id ? 'Actualizar' : 'Crear'}
              </button>
              <button type="button" onClick={() => navigate('/tasks')}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-semibold">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}