import logo from '../../assets/logo_tech.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/auth/register', form)
      setSuccess('Usuario creado, redirigiendo...')
      setTimeout(() => navigate('/login'), 1500)
    } catch {
      setError('Error al registrar usuario')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="TechSolutions" className="h-16" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Registro</h3>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[{ name: 'name', label: 'Nombre', type: 'text' }, { name: 'email', label: 'Email', type: 'email' }, { name: 'password', label: 'Contraseña', type: 'password' }].map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-600 mb-1">{f.label}</label>
              <input name={f.name} type={f.type} value={form[f.name]} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Rol</label>
            <select name="role" value={form.role} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="USER">Usuario</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          <button type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
            Registrar
          </button>
          <button type="button" onClick={() => navigate('/login')}
            className="w-full text-blue-600 text-sm text-center hover:underline">
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </form>
      </div>
    </div>
  )
}