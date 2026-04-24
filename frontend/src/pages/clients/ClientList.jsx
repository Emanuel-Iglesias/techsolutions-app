import logo from '../../assets/logo_tech.png'
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
          <h2 className="text-2xl font-bold text-gray-700">Clientes</h2>
          <button onClick={() => navigate('/clients/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
            + Nuevo Cliente
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Nombre</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Teléfono</th>
                <th className="px-6 py-3 text-left">Empresa</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{c.name}</td>
                  <td className="px-6 py-4 text-gray-600">{c.email}</td>
                  <td className="px-6 py-4 text-gray-600">{c.phone || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{c.company || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {c.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => navigate(`/clients/edit/${c.id}`)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded-lg text-xs hover:bg-yellow-500 transition">Editar</button>
                    <button onClick={() => handleDelete(c.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {clients.length === 0 && <p className="text-center text-gray-400 py-8">No hay clientes registrados</p>}
        </div>
      </div>
    </div>
  )
}