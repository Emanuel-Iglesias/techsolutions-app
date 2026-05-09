import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import logo from '../../assets/logo_tech.png'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function GeneralReport() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [clients, setClients] = useState([])
  const [users, setUsers] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/projects').then(res => setProjects(res.data))
    api.get('/tasks').then(res => setTasks(res.data))
    api.get('/clients').then(res => setClients(res.data))
    api.get('/auth/users').then(res => setUsers(res.data))
  }, [])

  const filteredProjects = projects.filter(p => {
    if (startDate && new Date(p.createdAt) < new Date(startDate)) return false
    if (endDate && new Date(p.createdAt) > new Date(endDate)) return false
    return true
  })

  const filteredTasks = tasks.filter(t => {
    if (startDate && new Date(t.createdAt) < new Date(startDate)) return false
    if (endDate && new Date(t.createdAt) > new Date(endDate)) return false
    return true
  })

  const statusLabel = { active: 'Activo', completed: 'Completado', paused: 'Pausado' }
  const statusStyle = {
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    paused: 'bg-yellow-100 text-yellow-700'
  }

  const handleFullReport = () => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.setTextColor(37, 99, 235)
    doc.text('TechSolutions', 14, 16)
    doc.setFontSize(14)
    doc.setTextColor(50, 50, 50)
    doc.text('Informe General del Sistema', 14, 26)
    doc.setFontSize(9)
    doc.setTextColor(150)
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 33)
    if (startDate || endDate) {
      doc.text(`Período: ${startDate || 'inicio'} — ${endDate || 'hoy'}`, 14, 39)
    }

    autoTable(doc, {
      startY: 44,
      head: [['Métrica', 'Valor']],
      body: [
        ['Total Clientes', clients.length],
        ['Total Proyectos', filteredProjects.length],
        ['Proyectos Activos', filteredProjects.filter(p => p.status === 'active').length],
        ['Proyectos Completados', filteredProjects.filter(p => p.status === 'completed').length],
        ['Total Tareas', filteredTasks.length],
        ['Tareas Completadas', filteredTasks.filter(t => t.status === 'completed').length],
        ['Tareas Pendientes', filteredTasks.filter(t => t.status === 'pending').length],
        ['Total Usuarios', users.length],
      ],
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 9 }
    })

    doc.addPage()
    doc.setFontSize(12)
    doc.setTextColor(50, 50, 50)
    doc.text('Proyectos', 14, 16)
    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Nombre', 'Cliente', 'Estado', 'Inicio', 'Fin']],
      body: filteredProjects.map(p => [
        p.id, p.name, p.client?.name || '-', p.status,
        new Date(p.startDate).toLocaleDateString(),
        p.endDate ? new Date(p.endDate).toLocaleDateString() : '-'
      ]),
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 9 }
    })

    doc.addPage()
    doc.setFontSize(12)
    doc.text('Tareas', 14, 16)
    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Título', 'Proyecto', 'Responsable', 'Prioridad', 'Estado']],
      body: filteredTasks.map(t => [
        t.id, t.title, t.project?.name || '-',
        t.user?.name || '-', t.priority, t.status
      ]),
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 9 }
    })

    doc.save(`informe_general_${Date.now()}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-4 sm:px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-2">
          <img src={logo} alt="TechSolutions" className="h-8" />
          <span className="text-lg font-bold hidden sm:block">TechSolutions</span>
        </div>
        <button onClick={() => navigate('/dashboard')} className="bg-white text-blue-600 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-100 transition">← Dashboard</button>
      </nav>

      <div className="max-w-6xl mx-auto mt-8 px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-700">Informe General</h2>
          <div className="flex flex-wrap gap-2 items-center">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <button onClick={() => { setStartDate(''); setEndDate('') }}
              className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition text-sm font-semibold">
              Limpiar
            </button>
            <button onClick={handleFullReport}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold text-sm">
              📄 Descargar PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Clientes', value: clients.length, color: 'bg-blue-500' },
            { label: 'Proyectos', value: filteredProjects.length, color: 'bg-green-500' },
            { label: 'Tareas', value: filteredTasks.length, color: 'bg-yellow-500' },
            { label: 'Usuarios', value: users.length, color: 'bg-purple-500' },
          ].map(card => (
            <div key={card.label} className={`${card.color} text-white rounded-2xl p-4 shadow`}>
              <p className="text-sm opacity-80">{card.label}</p>
              <p className="text-3xl font-bold mt-1">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow overflow-x-auto p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Proyectos y Avance</h3>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Avance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.map(p => {
                const projectTasks = tasks.filter(t => t.projectId === p.id)
                const completed = projectTasks.filter(t => t.status === 'completed').length
                const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                    <td className="px-4 py-3 text-gray-600">{p.client?.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyle[p.status]}`}>
                        {statusLabel[p.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-16">
                          <div className={`h-2 rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">{progress}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}