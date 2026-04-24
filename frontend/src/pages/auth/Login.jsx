import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch {
      setError('Credenciales incorrectas')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24 }}>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ display: 'block', width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Contraseña</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required style={{ display: 'block', width: '100%', marginBottom: 12 }} />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}