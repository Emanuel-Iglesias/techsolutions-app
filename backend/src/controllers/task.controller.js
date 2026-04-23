const prisma = require('../prisma')

const getAll = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: { project: true, user: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas' })
  }
}

const getOne = async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(req.params.id) },
      include: { project: true, user: true }
    })
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' })
    res.json(task)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tarea' })
  }
}

const create = async (req, res) => {
  try {
    const { title, description, priority, status, projectId, userId } = req.body
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        status: status || 'pending',
        projectId: Number(projectId),
        userId: userId ? Number(userId) : null
      }
    })
    res.status(201).json({ message: 'Tarea creada', task })
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tarea' })
  }
}

const update = async (req, res) => {
  try {
    const { title, description, priority, status, projectId, userId } = req.body
    const task = await prisma.task.update({
      where: { id: Number(req.params.id) },
      data: {
        title,
        description,
        priority,
        status,
        projectId: Number(projectId),
        userId: userId ? Number(userId) : null
      }
    })
    res.json({ message: 'Tarea actualizada', task })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar tarea' })
  }
}

const remove = async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Tarea eliminada' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tarea' })
  }
}

module.exports = { getAll, getOne, create, update, remove }