const prisma = require('../prisma')

const logChange = async (userId, entity, entityId, action, before, after) => {
  await prisma.changeLog.create({
    data: { userId, entity, entityId, action, before, after }
  })
}

const getAll = async (req, res) => {
  try {
    const { role, id } = req.user
    let tasks

    if (role === 'ADMIN') {
      tasks = await prisma.task.findMany({
        where: { deletedAt: null },
        include: { project: true, user: true },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      const client = await prisma.client.findUnique({ where: { userId: id } })
      if (!client) return res.json([])
      tasks = await prisma.task.findMany({
        where: { project: { clientId: client.id }, deletedAt: null },
        include: { project: true, user: true },
        orderBy: { createdAt: 'desc' }
      })
    }

    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas' })
  }
}

const getDeleted = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { deletedAt: { not: null } },
      include: { project: true, user: true },
      orderBy: { deletedAt: 'desc' }
    })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial' })
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
        title, description,
        priority: priority || 'MEDIUM',
        status: status || 'pending',
        projectId: Number(projectId),
        userId: userId ? Number(userId) : null
      }
    })
    await logChange(req.user.id, 'Task', task.id, 'CREATE', null, task)
    res.status(201).json({ message: 'Tarea creada', task })
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tarea' })
  }
}

const update = async (req, res) => {
  try {
    const before = await prisma.task.findUnique({ where: { id: Number(req.params.id) } })
    const { title, description, priority, status, projectId, userId } = req.body
    const task = await prisma.task.update({
      where: { id: Number(req.params.id) },
      data: {
        title, description, priority, status,
        projectId: Number(projectId),
        userId: userId ? Number(userId) : null
      }
    })
    await logChange(req.user.id, 'Task', task.id, 'UPDATE', before, task)
    res.json({ message: 'Tarea actualizada', task })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar tarea' })
  }
}

const remove = async (req, res) => {
  try {
    const before = await prisma.task.findUnique({ where: { id: Number(req.params.id) } })
    const task = await prisma.task.update({
      where: { id: Number(req.params.id) },
      data: { deletedAt: new Date() }
    })
    await logChange(req.user.id, 'Task', task.id, 'DELETE', before, null)
    res.json({ message: 'Tarea eliminada' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tarea' })
  }
}

module.exports = { getAll, getDeleted, getOne, create, update, remove }