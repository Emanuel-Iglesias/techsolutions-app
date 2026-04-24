import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function ProjectList() {
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()

  const fetchProjects = async () => {
    const res = await api.get('/projects')
    setProjects(res.data)
  }

  useEffect(() => { fetchProjects() }, [])

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar proyecto?')) return
    await api.delete(`/projects/${id}`)
    fetchProjects()
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Proyectos</h2>
      <button onClick={() => navigate('/projects/new')}>+ Nuevo Proyecto</button>
      <button onClick={() => navigate('/dashboard')} style={{ marginLeft: 12 }}>← Volver</button>
      <table border="1" cellPadding="8" style={{ marginTop: 16, width: '100%' }}>
        <thead>
          <tr>
            <th>Nombre</th><th>Cliente</th><th>Estado</th><th>Inicio</th><th>Fin</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.client?.name}</td>
              <td>{p.status}</td>
              <td>{new Date(p.startDate).toLocaleDateString()}</td>
              <td>{p.endDate ? new Date(p.endDate).toLocaleDateString() : '-'}</td>
              <td>
                <button onClick={() => navigate(`/projects/edit/${p.id}`)}>Editar</button>
                <button onClick={() => handleDelete(p.id)} style={{ marginLeft: 8 }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}