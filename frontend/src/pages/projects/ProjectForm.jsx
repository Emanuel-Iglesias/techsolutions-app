import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'

export default function ProjectForm() {
  const [form, setForm] = useState({ name: '', description: '', startDate: '', endDate: '', status: 'active', clientId: '' })
  const [clients, setClients] = useState([])
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/clients').then(res => setClients(res.data))
    if (id) {
      api.get(`/projects/${id}`).then(res => {
        const p = res.data
        setForm({
          name: p.name,
          description: p.description || '',
          startDate: p.startDate.split('T')[0],
          endDate: p.endDate ? p.endDate.split('T')[0] : '',
          status: p.status,
          clientId: p.clientId
        })
      })
    }
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (id) {
      await api.put(`/projects/${id}`, form)
    } else {
      await api.post('/projects', form)
    }
    navigate('/projects')
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24 }}>
      <h2>{id ? 'Editar' : 'Nuevo'} Proyecto</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input name="name" value={form.name} onChange={handleChange} required style={{ display: 'block', width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Fecha Inicio</label>
          <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required style={{ display: 'block', width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Fecha Fin</label>
          <input name="endDate" type="date" value={form.endDate} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Estado</label>
          <select name="status" value={form.status} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: 12 }}>
            <option value="active">Activo</option>
            <option value="completed">Completado</option>
            <option value="paused">Pausado</option>
          </select>
        </div>
        <div>
          <label>Cliente</label>
          <select name="clientId" value={form.clientId} onChange={handleChange} required style={{ display: 'block', width: '100%', marginBottom: 12 }}>
            <option value="">Seleccionar cliente</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <button type="submit">{id ? 'Actualizar' : 'Crear'}</button>
        <button type="button" onClick={() => navigate('/projects')} style={{ marginLeft: 12 }}>Cancelar</button>
      </form>
    </div>
  )
}