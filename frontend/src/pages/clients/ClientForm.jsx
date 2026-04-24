import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'

export default function ClientForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', status: 'active' })
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      api.get(`/clients/${id}`).then(res => setForm(res.data))
    }
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (id) {
      await api.put(`/clients/${id}`, form)
    } else {
      await api.post('/clients', form)
    }
    navigate('/clients')
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24 }}>
      <h2>{id ? 'Editar' : 'Nuevo'} Cliente</h2>
      <form onSubmit={handleSubmit}>
        {['name', 'email', 'phone', 'company'].map(field => (
          <div key={field}>
            <label>{field}</label>
            <input name={field} value={form[field]} onChange={handleChange} required={field !== 'phone' && field !== 'company'} style={{ display: 'block', width: '100%', marginBottom: 12 }} />
          </div>
        ))}
        <div>
          <label>Estado</label>
          <select name="status" value={form.status} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: 12 }}>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
        <button type="submit">{id ? 'Actualizar' : 'Crear'}</button>
        <button type="button" onClick={() => navigate('/clients')} style={{ marginLeft: 12 }}>Cancelar</button>
      </form>
    </div>
  )
}