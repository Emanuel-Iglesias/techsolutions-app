import { useEffect, useRef } from 'react'
import Gantt from 'frappe-gantt'

export default function GanttChart({ tasks }) {
  const ganttRef = useRef(null)

  const validTasks = tasks.filter(t => t.startDate && t.endDate)

  const ganttTasks = validTasks.map(t => ({
    id: String(t.id),
    name: t.title,
    start: t.startDate.split('T')[0],
    end: t.endDate.split('T')[0],
    progress: t.status === 'completed' ? 100 : t.status === 'in_progress' ? 50 : 0,
    custom_class: t.priority === 'HIGH' ? 'bar-high' : t.priority === 'MEDIUM' ? 'bar-medium' : 'bar-low'
  }))

  useEffect(() => {
    if (ganttRef.current && ganttTasks.length > 0) {
      ganttRef.current.innerHTML = ''
      new Gantt(ganttRef.current, ganttTasks, {
        view_mode: 'Day',
        date_format: 'YYYY-MM-DD',
        language: 'es'
      })
    }
  }, [tasks])

  if (validTasks.length === 0) {
    return <p className="text-gray-400 text-center py-4">No hay tareas con fechas definidas para mostrar el diagrama</p>
  }

  return (
    <div className="overflow-x-auto">
      <style>{`
        .bar-high .bar { fill: #ef4444 }
        .bar-medium .bar { fill: #eab308 }
        .bar-low .bar { fill: #22c55e }
      `}</style>
      <div ref={ganttRef} />
    </div>
  )
}