import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import logo from '../../assets/logo_tech.png'
import { generateReport } from '../../utils/report'

export default function UserList() {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  const fetchUsers = async () => {
    const res = await api.get('/auth/users')
    setUsers(res.data)
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar usuario?')) return
    await api.delete(`/auth/users/${id}`)
    fetchUsers()
  }

  const handleReport = () => {
    const columns = ['ID', 'Nombre', 'Email', 'Rol', 'Creado']
    const rows = users.map(u => [
      u.id,
      u.name,
      u.email,
      u.role === 'ADMIN' ? 'Administrador' : 'Cliente',
      new Date(u.createdAt).toLocaleDateString()
    ])
    generateReport('Reporte de Usuarios', columns, rows)
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h2 className="text-2xl font-bold text-gray-700">Usuarios</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleReport} className="bg-indigo-500 text-white px-3 py-2 rounded-lg hover:bg-indigo-600 transition font-semibold text-sm">📄 Reporte</button>
            <button onClick={() => navigate('/history?entity=users')} className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition font-semibold text-sm">📋 Historial</button>
            <button onClick={() => navigate('/users/new')} className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm">+ Nuevo Usuario</button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Nombre</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Rol</th>
                <th className="px-6 py-3 text-left">Creado</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{u.name}</td>
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : u.role === 'EMPLOYEE' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role === 'ADMIN' ? 'Administrador' : u.role === 'EMPLOYEE' ? 'Empleado' : 'Cliente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => navigate(`/users/edit/${u.id}`)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded-lg text-xs hover:bg-yellow-500 transition">Editar</button>
                    <button onClick={() => handleDelete(u.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="text-center text-gray-400 py-8">No hay usuarios registrados</p>}
        </div>
      </div>
    </div>
  )
}