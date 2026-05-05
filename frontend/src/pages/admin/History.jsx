import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../api/axios'
import logo from '../../assets/logo_tech.png'

const entityConfig = {
  clients: { label: 'Clientes', deletedUrl: '/clients/deleted', changeEntity: 'Client' },
  projects: { label: 'Proyectos', deletedUrl: '/projects/deleted', changeEntity: 'Project' },
  tasks: { label: 'Tareas', deletedUrl: '/tasks/deleted', changeEntity: 'Task' },
  users: { label: 'Usuarios', deletedUrl: '/auth/users/deleted', changeEntity: 'User' },
}

export default function History() {
  const [deleted, setDeleted] = useState([])
  const [changes, setChanges] = useState([])
  const [tab, setTab] = useState('deleted')
  const [selected, setSelected] = useState(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const entity = searchParams.get('entity') || 'clients'
  const config = entityConfig[entity]

  useEffect(() => {
    api.get(config.deletedUrl).then(res => setDeleted(res.data))
    api.get('/changelog').then(res => {
      setChanges(res.data.filter(l => l.entity === config.changeEntity))
    })
  }, [entity])

  const actionStyle = {
    CREATE: 'bg-green-100 text-green-700',
    UPDATE: 'bg-yellow-100 text-yellow-700',
    DELETE: 'bg-red-100 text-red-700'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-2">
          <img src={logo} alt="TechSolutions" className="h-8" />
          <span className="text-lg font-bold">TechSolutions</span>
        </div>
        <button onClick={() => navigate(`/${entity}`)} className="bg-white text-blue-600 px-4 py-1 rounded-lg text-sm font-semibold hover:bg-gray-100 transition">← {config.label}</button>
      </nav>

      <div className="max-w-6xl mx-auto mt-8 px-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Historial — {config.label}</h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('deleted')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${tab === 'deleted' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            🗑 Eliminados
          </button>
          <button onClick={() => setTab('changes')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${tab === 'changes' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            📋 Cambios
          </button>
        </div>

        {/* Eliminados */}
        {tab === 'deleted' && (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Nombre / Título</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Eliminado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deleted.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-500">#{d.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{d.name || d.title}</td>
                    <td className="px-6 py-4 text-gray-600">{d.email || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(d.deletedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {deleted.length === 0 && <p className="text-center text-gray-400 py-8">No hay registros eliminados</p>}
          </div>
        )}

        {/* Cambios */}
        {tab === 'changes' && (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Usuario</th>
                  <th className="px-6 py-3 text-left">Acción</th>
                  <th className="px-6 py-3 text-left">ID Entidad</th>
                  <th className="px-6 py-3 text-left">Fecha</th>
                  <th className="px-6 py-3 text-left">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {changes.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{l.user?.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${actionStyle[l.action]}`}>
                        {l.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">#{l.entityId}</td>
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
            {changes.length === 0 && <p className="text-center text-gray-400 py-8">No hay cambios registrados</p>}
          </div>
        )}
      </div>

      {/* Modal detalle */}
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