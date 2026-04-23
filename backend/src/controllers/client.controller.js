const prisma = require('../prisma')

const getAll = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(clients)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener clientes' })
  }
}

const getOne = async (req, res) => {
  try {
    const client = await prisma.client.findUnique({ where: { id: Number(req.params.id) } })
    if (!client) return res.status(404).json({ message: 'Cliente no encontrado' })
    res.json(client)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cliente' })
  }
}

const create = async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body
    const client = await prisma.client.create({
      data: { name, email, phone, company, status: status || 'active' }
    })
    res.status(201).json({ message: 'Cliente creado', client })
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cliente' })
  }
}

const update = async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body
    const client = await prisma.client.update({
      where: { id: Number(req.params.id) },
      data: { name, email, phone, company, status }
    })
    res.json({ message: 'Cliente actualizado', client })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar cliente' })
  }
}

const remove = async (req, res) => {
  try {
    await prisma.client.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Cliente eliminado' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar cliente' })
  }
}

module.exports = { getAll, getOne, create, update, remove }