import logo from '../../assets/logo_tech.png'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'

export default function ClientForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', status: 'active' })
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) api.get(`/clients/${id}`).then(res => setForm(res.data))
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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-2">
          <img src={logo} alt="TechSolutions" className="h-8" />
          <span className="text-lg font-bold">TechSolutions</span>
        </div>
        <button onClick={() => navigate('/clients')} className="bg-white text-blue-600 px-4 py-1 rounded-lg text-sm font-semibold hover:bg-gray-100 transition">← Clientes</button>
      </nav>
      <div className="max-w-lg mx-auto mt-10 px-6">
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">{id ? 'Editar' : 'Nuevo'} Cliente</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[{ name: 'name', label: 'Nombre', required: true }, { name: 'email', label: 'Email', required: true }, { name: 'phone', label: 'Teléfono', required: false }, { name: 'company', label: 'Empresa', required: false }].map(f => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-gray-600 mb-1">{f.label}</label>
                <input name={f.name} value={form[f.name]} onChange={handleChange} required={f.required}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Estado</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                {id ? 'Actualizar' : 'Crear'}
              </button>
              <button type="button" onClick={() => navigate('/clients')}
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