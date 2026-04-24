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
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24 }}>
      <h2>{id ? 'Editar' : 'Nueva'} Tarea</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título</label>
          <input name="title" value={form.title} onChange={handleChange} required style={{ display: 'block', width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Prioridad</label>
          <select name="priority" value={form.priority} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: 12 }}>
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
          </select>
        </div>
        <div>
          <label>Estado</label>
          <select name="status" value={form.status} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: 12 }}>
            <option value="pending">Pendiente</option>
            <option value="in_progress">En progreso</option>
            <option value="completed">Completado</option>
          </select>
        </div>
        <div>
          <label>Proyecto</label>
          <select name="projectId" value={form.projectId} onChange={handleChange} required style={{ display: 'block', width: '100%', marginBottom: 12 }}>
            <option value="">Seleccionar proyecto</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label>Responsable (opcional)</label>
          <select name="userId" value={form.userId} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: 12 }}>
            <option value="">Sin asignar</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <button type="submit">{id ? 'Actualizar' : 'Crear'}</button>
        <button type="button" onClick={() => navigate('/tasks')} style={{ marginLeft: 12 }}>Cancelar</button>
      </form>
    </div>
  )
}