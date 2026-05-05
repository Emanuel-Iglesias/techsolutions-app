import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import logo from '../../assets/logo_tech.png'

export default function ChangeLog() {
  const [logs, setLogs] = useState([])
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/changelog').then(res => setLogs(res.data))
  }, [])

  const actionStyle = {
    CREATE: 'bg-green-100 text-green-700',
    UPDATE: 'bg-yellow-100 text-yellow-700',
    DELETE: 'bg-red-100 text-red-700'
  }

  const entityLabel = { Client: 'Cliente', Project: 'Proyecto', Task: 'Tarea' }

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
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Historial de Cambios</h2>
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Usuario</th>
                <th className="px-6 py-3 text-left">Entidad</th>
                <th className="px-6 py-3 text-left">Acción</th>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-left">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map(l => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{l.user?.name}</td>
                  <td className="px-6 py-4 text-gray-600">{entityLabel[l.entity] || l.entity} #{l.entityId}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${actionStyle[l.action]}`}>
                      {l.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => setSelected(l)}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs hover:bg-blue-200 transition">
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && <p className="text-center text-gray-400 py-8">No hay cambios registrados</p>}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Detalle del Cambio</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">ANTES</p>
                <pre className="bg-gray-50 rounded-lg p-3 text-xs overflow-auto max-h-60">
                  {selected.before ? JSON.stringify(selected.before, null, 2) : 'N/A'}
                </pre>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">DESPUÉS</p>
                <pre className="bg-gray-50 rounded-lg p-3 text-xs overflow-auto max-h-60">
                  {selected.after ? JSON.stringify(selected.after, null, 2) : 'N/A'}
                </pre>
              </div>
            </div>
            <button onClick={() => setSelected(null)}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}