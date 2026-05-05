import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'
import logo from '../../assets/logo_tech.png'
import { useAuth } from '../../context/AuthContext'
import GanttChart from '../../components/GanttChart'

export default function ProjectDetail() {
  const [project, setProject] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    api.get(`/projects/${id}`).then(res => setProject(res.data))
  }, [id])

  if (!project) return <div className="p-8 text-gray-500">Cargando...</div>

  const totalTasks = project.tasks?.length || 0
  const completedTasks = project.tasks?.filter(t => t.status === 'completed').length || 0
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const statusLabel = { active: 'Activo', completed: 'Completado', paused: 'Pausado' }
  const statusStyle = {
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    paused: 'bg-yellow-100 text-yellow-700'
  }

  const priorityLabel = { HIGH: 'Alta', MEDIUM: 'Media', LOW: 'Baja' }
  const priorityStyle = {
    HIGH: 'bg-red-100 text-red-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    LOW: 'bg-green-100 text-green-700'
  }

  const taskStatusLabel = { pending: 'Pendiente', in_progress: 'En progreso', completed: 'Completado' }
  const taskStatusStyle = {
    pending: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-2">
          <img src={logo} alt="TechSolutions" className="h-8" />
          <span className="text-lg font-bold">TechSolutions</span>
        </div>
        <button onClick={() => navigate('/projects')} className="bg-white text-blue-600 px-4 py-1 rounded-lg text-sm font-semibold hover:bg-gray-100 transition">← Proyectos</button>
      </nav>

      <div className="max-w-4xl mx-auto mt-8 px-6 space-y-6">
        {/* Info del proyecto */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{project.name}</h2>
              <p className="text-gray-500 mt-1">{project.description || 'Sin descripción'}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusStyle[project.status]}`}>
              {statusLabel[project.status]}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div><span className="font-medium">Cliente:</span> {project.client?.name}</div>
            <div><span className="font-medium">Inicio:</span> {new Date(project.startDate).toLocaleDateString()}</div>
            <div><span className="font-medium">Fin:</span> {project.endDate ? new Date(project.endDate).toLocaleDateString() : '-'}</div>
            <div><span className="font-medium">Tareas:</span> {completedTasks}/{totalTasks} completadas</div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-3">Avance del Proyecto</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${progress === 100 ? 'bg-green-500' : progress > 50 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-lg font-bold text-gray-700">{progress}%</span>
          </div>
        </div>

        {/* Diagrama de Gantt */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Diagrama de Gantt</h3>
          <GanttChart tasks={project.tasks || []} />
        </div>

        {/* Tareas del proyecto */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Tareas</h3>
          {project.tasks?.length === 0 && <p className="text-gray-400 text-center py-4">No hay tareas en este proyecto</p>}
          <div className="space-y-3">
            {project.tasks?.map(t => (
              <div key={t.id} className="border border-gray-100 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{t.title}</p>
                  {t.description && <p className="text-sm text-gray-500 mt-1">{t.description}</p>}
                </div>
                <div className="flex gap-2 items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityStyle[t.priority]}`}>
                    {priorityLabel[t.priority]}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${taskStatusStyle[t.status]}`}>
                    {taskStatusLabel[t.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}