import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function ClientList() {
  const [clients, setClients] = useState([])
  const navigate = useNavigate()

  const fetchClients = async () => {
    const res = await api.get('/clients')
    setClients(res.data)
  }

  useEffect(() => { fetchClients() }, [])

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar cliente?')) return
    await api.delete(`/clients/${id}`)
    fetchClients()
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Clientes</h2>
      <button onClick={() => navigate('/clients/new')}>+ Nuevo Cliente</button>
      <button onClick={() => navigate('/dashboard')} style={{ marginLeft: 12 }}>← Volver</button>
      <table border="1" cellPadding="8" style={{ marginTop: 16, width: '100%' }}>
        <thead>
          <tr>
            <th>Nombre</th><th>Email</th><th>Teléfono</th><th>Empresa</th><th>Estado</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.company}</td>
              <td>{c.status}</td>
              <td>
                <button onClick={() => navigate(`/clients/edit/${c.id}`)}>Editar</button>
                <button onClick={() => handleDelete(c.id)} style={{ marginLeft: 8 }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}