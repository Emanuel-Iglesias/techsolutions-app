const prisma = require('../prisma')

const logChange = async (userId, entity, entityId, action, before, after) => {
  await prisma.changeLog.create({
    data: { userId, entity, entityId, action, before, after }
  })
}

const getAll = async (req, res) => {
  try {
    const { role, id } = req.user
    let clients

    if (role === 'ADMIN') {
      clients = await prisma.client.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      clients = await prisma.client.findMany({
        where: { userId: id, deletedAt: null }
      })
    }

    res.json(clients)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener clientes' })
  }
}

const getDeleted = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' }
    })
    res.json(clients)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial' })
  }
}

const getAvailable = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      where: { userId: null, deletedAt: null },
      orderBy: { name: 'asc' }
    })
    res.json(clients)
  } catch (error) {
    console.error('Error getAvailable:', error)
    res.status(500).json({ message: 'Error al obtener clientes disponibles' })
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
    const { name, email, phone, company, status, userId } = req.body

    const exists = await prisma.client.findUnique({ where: { email } })
    if (exists) return res.status(400).json({ message: 'El correo ya está registrado' })

    const client = await prisma.client.create({
      data: { name, email, phone, company, status: status || 'active', userId: userId ? Number(userId) : null }
    })
    await logChange(req.user.id, 'Client', client.id, 'CREATE', null, client)
    res.status(201).json({ message: 'Cliente creado', client })
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cliente' })
  }
}

const update = async (req, res) => {
  try {
    const before = await prisma.client.findUnique({ where: { id: Number(req.params.id) } })
    const { name, email, phone, company, status } = req.body
    const client = await prisma.client.update({
      where: { id: Number(req.params.id) },
      data: { name, email, phone, company, status }
    })
    await logChange(req.user.id, 'Client', client.id, 'UPDATE', before, client)
    res.json({ message: 'Cliente actualizado', client })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar cliente' })
  }
}

const remove = async (req, res) => {
  try {
    const before = await prisma.client.findUnique({ where: { id: Number(req.params.id) } })
    const client = await prisma.client.update({
      where: { id: Number(req.params.id) },
      data: { deletedAt: new Date() }
    })
    await logChange(req.user.id, 'Client', client.id, 'DELETE', before, null)
    res.json({ message: 'Cliente eliminado' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar cliente' })
  }
}



module.exports = { getAll, getDeleted, getAvailable, getOne, create, update, remove }