const prisma = require('../prisma')

const getAll = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { client: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json(projects)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proyectos' })
  }
}

const getOne = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: Number(req.params.id) },
      include: { client: true, tasks: true }
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
      data: { name, description, startDate: new Date(startDate), endDate: endDate ? new Date(endDate) : null, status: status || 'active', clientId: Number(clientId) }
    })
    res.status(201).json({ message: 'Proyecto creado', project })
  } catch (error) {
    res.status(500).json({ message: 'Error al crear proyecto' })
  }
}

const update = async (req, res) => {
  try {
    const { name, description, startDate, endDate, status, clientId } = req.body
    const project = await prisma.project.update({
      where: { id: Number(req.params.id) },
      data: { name, description, startDate: new Date(startDate), endDate: endDate ? new Date(endDate) : null, status, clientId: Number(clientId) }
    })
    res.json({ message: 'Proyecto actualizado', project })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar proyecto' })
  }
}

const remove = async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Proyecto eliminado' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar proyecto' })
  }
}

module.exports = { getAll, getOne, create, update, remove }