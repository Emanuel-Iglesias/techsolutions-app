import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'
import logo from '../../assets/logo_tech.png'

export default function UserForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CLIENT', clientId: '' })
  const [availableClients, setAvailableClients] = useState([])
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/clients/available').then(res => setAvailableClients(res.data))
    if (id) {
      api.get('/auth/users').then(res => {
        const user = res.data.find(u => u.id === Number(id))
        if (user) setForm({ name: user.name, email: user.email, password: '', role: user.role, clientId: '' })
      })
    }
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('form:', form)
    try {
      if (id) {
        await api.put(`/auth/users/${id}`, form)
      } else {
        await api.post('/auth/register', { ...form, clientId: form.clientId ? Number(form.clientId) : null })
      }
      navigate('/users')
    } catch (error) {
      console.error('Error:', error.response?.data)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-4 sm:px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-2">
          <img src={logo} alt="TechSolutions" className="h-8" />
          <span className="text-lg font-bold hidden sm:block">TechSolutions</span>
        </div>
        <button onClick={() => navigate('/users')} className="bg-white text-blue-600 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-100 transition">← Usuarios</button>
      </nav>
      <div className="max-w-lg mx-auto mt-10 px-6">
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">{id ? 'Editar' : 'Nuevo'} Usuario</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
              <input name="name" value={form.name} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{id ? 'Nueva Contraseña (opcional)' : 'Contraseña'}</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required={!id}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Rol</label>
              <select name="role" value={form.role} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="CLIENT">Cliente</option>
                <option value="EMPLOYEE">Empleado</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            {form.role === 'CLIENT' && !id && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Asociar a Cliente</label>
                <select name="clientId" value={form.clientId} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="">Seleccionar cliente</option>
                  {availableClients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} — {c.email}</option>
                  ))}
                </select>
                {availableClients.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">No hay clientes sin usuario asignado</p>
                )}
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                {id ? 'Actualizar' : 'Crear'}
              </button>
              <button type="button" onClick={() => navigate('/users')}
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