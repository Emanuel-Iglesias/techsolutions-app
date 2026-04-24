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

  return (
    <div style={{ padding: 24 }}>
      <h2>Tareas</h2>
      <button onClick={() => navigate('/tasks/new')}>+ Nueva Tarea</button>
      <button onClick={() => navigate('/dashboard')} style={{ marginLeft: 12 }}>← Volver</button>
      <table border="1" cellPadding="8" style={{ marginTop: 16, width: '100%' }}>
        <thead>
          <tr>
            <th>Título</th><th>Proyecto</th><th>Responsable</th><th>Prioridad</th><th>Estado</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(t => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>{t.project?.name}</td>
              <td>{t.user?.name || '-'}</td>
              <td>{t.priority}</td>
              <td>{t.status}</td>
              <td>
                <button onClick={() => navigate(`/tasks/edit/${t.id}`)}>Editar</button>
                <button onClick={() => handleDelete(t.id)} style={{ marginLeft: 8 }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}