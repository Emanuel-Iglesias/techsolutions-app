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
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24 }}>
      <h2>Registro</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input name="name" value={form.name} onChange={handleChange} required style={{ display: 'block', width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ display: 'block', width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Contraseña</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required style={{ display: 'block', width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Rol</label>
          <select name="role" value={form.role} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: 12 }}>
            <option value="USER">Usuario</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  )
}