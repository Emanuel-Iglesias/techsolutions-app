const prisma = require('../prisma')

const logChange = async (userId, entity, entityId, action, before, after) => {
  await prisma.changeLog.create({
    data: { userId, entity, entityId, action, before, after }
  })
}

const getAll = async (req, res) => {
  try {
    const { role, id } = req.user
    let projects

    if (role === 'ADMIN') {
      projects = await prisma.project.findMany({
        where: { deletedAt: null },
        include: { client: true },
        orderBy: { createdAt: 'desc' }
      })
    } else if (role === 'EMPLOYEE') {
      projects = await prisma.project.findMany({
        where: {
          deletedAt: null,
          tasks: { some: { userId: id, deletedAt: null } }
        },
        include: { client: true },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      const client = await prisma.client.findUnique({ where: { userId: id } })
      if (!client) return res.json([])
      projects = await prisma.project.findMany({
        where: { clientId: client.id, deletedAt: null },
        include: { client: true, tasks: true },
        orderBy: { createdAt: 'desc' }
      })
    }

    res.json(projects)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proyectos' })
  }
}

const getDeleted = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { deletedAt: { not: null } },
      include: { client: true },
      orderBy: { deletedAt: 'desc' }
    })
    res.json(projects)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial' })
  }
}

const getOne = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: Number(req.params.id) },
      include: { client: true, tasks: { where: { deletedAt: null } } }
    })
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' })
    res.json(project)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proyecto' })
  }
}

const create = async (req, res) => {
  try {
    const { name, description, startDate, endDate, status, clientId } = req.body
    const project = await prisma.project.create({
      data: {
        name, description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'active',
        clientId: Number(clientId)
      }
    })
    await logChange(req.user.id, 'Project', project.id, 'CREATE', null, project)
    res.status(201).json({ message: 'Proyecto creado', project })
  } catch (error) {
    res.status(500).json({ message: 'Error al crear proyecto' })
  }
}

const update = async (req, res) => {
  try {
    const before = await prisma.project.findUnique({ where: { id: Number(req.params.id) } })
    const { name, description, startDate, endDate, status, clientId } = req.body
    const project = await prisma.project.update({
      where: { id: Number(req.params.id) },
      data: {
        name, description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status,
        clientId: Number(clientId)
      }
    })
    await logChange(req.user.id, 'Project', project.id, 'UPDATE', before, project)
    res.json({ message: 'Proyecto actualizado', project })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar proyecto' })
  }
}

const remove = async (req, res) => {
  try {
    const before = await prisma.project.findUnique({ where: { id: Number(req.params.id) } })
    const project = await prisma.project.update({
      where: { id: Number(req.params.id) },
      data: { deletedAt: new Date() }
    })
    await logChange(req.user.id, 'Project', project.id, 'DELETE', before, null)
    res.json({ message: 'Proyecto eliminado' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar proyecto' })
  }
}

module.exports = { getAll, getDeleted, getOne, create, update, remove }