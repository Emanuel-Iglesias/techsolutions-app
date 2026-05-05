import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import logo from '../../assets/logo_tech.png'
import { useAuth } from '../../context/AuthContext'
import { generateReport } from '../../utils/report'

export default function ProjectList() {
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const fetchProjects = async () => {
    const res = await api.get('/projects')
    setProjects(res.data)
  }

  useEffect(() => { fetchProjects() }, [])

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar proyecto?')) return
    await api.delete(`/projects/${id}`)
    fetchProjects()
  }

  const handleReport = () => {
    const columns = ['ID', 'Nombre', 'Cliente', 'Estado', 'Inicio', 'Fin']
    const rows = projects.map(p => [
      p.id,
      p.name,
      p.client?.name || '-',
      p.status,
      new Date(p.startDate).toLocaleDateString(),
      p.endDate ? new Date(p.endDate).toLocaleDateString() : '-'
    ])
    generateReport('Reporte de Proyectos', columns, rows)
  }

  const statusStyle = {
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    paused: 'bg-yellow-100 text-yellow-700'
  }
  const statusLabel = { active: 'Activo', completed: 'Completado', paused: 'Pausado' }

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
          <h2 className="text-2xl font-bold text-gray-700">{isAdmin ? 'Proyectos' : 'Mis Proyectos'}</h2>
          <div className="flex gap-2">
            {isAdmin && (
              <>
                <button onClick={handleReport}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition font-semibold">
                  📄 Reporte
                </button>
                <button onClick={() => navigate('/history?entity=projects')}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition font-semibold">
                  📋 Historial
                </button>
                <button onClick={() => navigate('/projects/new')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold">
                  + Nuevo Proyecto
                </button>
              </>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Nombre</th>
                <th className="px-6 py-3 text-left">Cliente</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Inicio</th>
                <th className="px-6 py-3 text-left">Fin</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/projects/${p.id}`)}>
                  <td className="px-6 py-4 font-medium text-gray-800">{p.name}</td>
                  <td className="px-6 py-4 text-gray-600">{p.client?.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyle[p.status]}`}>
                      {statusLabel[p.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{new Date(p.startDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-gray-600">{p.endDate ? new Date(p.endDate).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                    {isAdmin ? (
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/projects/edit/${p.id}`)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded-lg text-xs hover:bg-yellow-500 transition">Editar</button>
                        <button onClick={() => handleDelete(p.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition">Eliminar</button>
                      </div>
                    ) : (
                      <button onClick={() => navigate(`/projects/${p.id}`)}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs hover:bg-blue-200 transition">Ver detalle</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 && <p className="text-center text-gray-400 py-8">No hay proyectos registrados</p>}
        </div>
      </div>
    </div>
  )
}