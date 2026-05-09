import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts'
import api from '../../api/axios'
import logo from '../../assets/logo_tech.png'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6']

export default function Analytics() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [clients, setClients] = useState([])
  const [selectedProject, setSelectedProject] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/projects').then(res => setProjects(res.data))
    api.get('/tasks').then(res => setTasks(res.data))
    api.get('/clients').then(res => setClients(res.data))
  }, [])

  const filteredTasks = selectedProject ? tasks.filter(t => t.projectId === Number(selectedProject)) : tasks
  const filteredProjects = selectedProject ? projects.filter(p => p.id === Number(selectedProject)) : projects

  const projectProgress = filteredProjects.map(p => {
    const projectTasks = tasks.filter(t => t.projectId === p.id)
    const completed = projectTasks.filter(t => t.status === 'completed').length
    const total = projectTasks.length
    return {
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      avance: total > 0 ? Math.round((completed / total) * 100) : 0,
      total,
      completed
    }
  })

  const tasksByStatus = [
    { name: 'Pendiente', value: filteredTasks.filter(t => t.status === 'pending').length },
    { name: 'En progreso', value: filteredTasks.filter(t => t.status === 'in_progress').length },
    { name: 'Completado', value: filteredTasks.filter(t => t.status === 'completed').length },
  ]

  const tasksByPriority = [
    { name: 'Alta', value: filteredTasks.filter(t => t.priority === 'HIGH').length },
    { name: 'Media', value: filteredTasks.filter(t => t.priority === 'MEDIUM').length },
    { name: 'Baja', value: filteredTasks.filter(t => t.priority === 'LOW').length },
  ]

  const projectsByStatus = [
    { name: 'Activo', value: filteredProjects.filter(p => p.status === 'active').length },
    { name: 'Completado', value: filteredProjects.filter(p => p.status === 'completed').length },
    { name: 'Pausado', value: filteredProjects.filter(p => p.status === 'paused').length },
  ]

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.setTextColor(37, 99, 235)
    doc.text('TechSolutions', 14, 16)
    doc.setFontSize(13)
    doc.setTextColor(50, 50, 50)
    doc.text('Reporte de Analíticas', 14, 26)
    doc.setFontSize(9)
    doc.setTextColor(150)
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 33)
    if (selectedProject) {
      const p = projects.find(p => p.id === Number(selectedProject))
      doc.text(`Proyecto: ${p?.name}`, 14, 39)
    }

    autoTable(doc, {
      startY: 44,
      head: [['Métrica', 'Valor']],
      body: [
        ['Total Tareas', filteredTasks.length],
        ['Tareas Pendientes', filteredTasks.filter(t => t.status === 'pending').length],
        ['Tareas En Progreso', filteredTasks.filter(t => t.status === 'in_progress').length],
        ['Tareas Completadas', filteredTasks.filter(t => t.status === 'completed').length],
        ['Prioridad Alta', filteredTasks.filter(t => t.priority === 'HIGH').length],
        ['Prioridad Media', filteredTasks.filter(t => t.priority === 'MEDIUM').length],
        ['Prioridad Baja', filteredTasks.filter(t => t.priority === 'LOW').length],
      ],
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 9 }
    })

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Proyecto', 'Avance %', 'Tareas', 'Completadas']],
      body: projectProgress.map(p => [p.name, `${p.avance}%`, p.total, p.completed]),
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 9 }
    })

    doc.save(`analiticas_${Date.now()}.pdf`)
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
          <h2 className="text-2xl font-bold text-gray-700">Analíticas</h2>
          <div className="flex flex-wrap gap-2 items-center">
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Todos los proyectos</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button onClick={handleExportPDF}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold text-sm">
              📄 Exportar PDF
            </button>
          </div>
        </div>

        {/* Tarjetas resumen */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Clientes', value: clients.length, color: 'bg-blue-500' },
            { label: 'Proyectos', value: filteredProjects.length, color: 'bg-green-500' },
            { label: 'Tareas', value: filteredTasks.length, color: 'bg-yellow-500' },
            { label: 'Completadas', value: filteredTasks.filter(t => t.status === 'completed').length, color: 'bg-purple-500' },
          ].map(card => (
            <div key={card.label} className={`${card.color} text-white rounded-2xl p-4 shadow`}>
              <p className="text-sm opacity-80">{card.label}</p>
              <p className="text-3xl font-bold mt-1">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Avance por proyecto */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Avance por Proyecto (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(val) => `${val}%`} />
              <Bar dataKey="avance" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Tareas por Estado</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={tasksByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {tasksByStatus.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Tareas por Prioridad</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={tasksByPriority} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {tasksByPriority.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Proyectos por Estado</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={projectsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {projectsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}