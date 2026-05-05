const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = require('../prisma')

const register = async (req, res) => {
  try {
    const { name, email, password, role, clientId } = req.body

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return res.status(400).json({ message: 'El correo ya está registrado' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || 'CLIENT' }
    })

    if (role === 'CLIENT' && clientId) {
      await prisma.client.update({
        where: { id: Number(clientId) },
        data: { userId: user.id }
      })
    }

    res.status(201).json({ message: 'Usuario creado', user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ message: 'Credenciales incorrectas' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json({ message: 'Credenciales incorrectas' })

    // Registrar sesión
    await prisma.sessionLog.create({
      data: {
        userId: user.id,
        ip: req.ip || req.headers['x-forwarded-for'] || null
      }
    })

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' })
  }
}

const getDeletedUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { deletedAt: { not: null } },
      select: { id: true, name: true, email: true, role: true, deletedAt: true }
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial' })
  }
}

const updateUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body
    const data = { name, email, role }
    if (password) data.password = await bcrypt.hash(password, 10)

    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data,
      select: { id: true, name: true, email: true, role: true }
    })
    res.json({ message: 'Usuario actualizado', user })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario' })
  }
}

const deleteUser = async (req, res) => {
  try {
    const before = await prisma.user.findUnique({ where: { id: Number(req.params.id) } })
    await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { deletedAt: new Date() }
    })
    await prisma.changeLog.create({
      data: { userId: req.user.id, entity: 'User', entityId: Number(req.params.id), action: 'DELETE', before, after: null }
    })
    res.json({ message: 'Usuario eliminado' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario' })
  }
}

const getSessions = async (req, res) => {
  try {
    const sessions = await prisma.sessionLog.findMany({
      include: { user: { select: { name: true, email: true, role: true } } },
      orderBy: { loginAt: 'desc' }
    })
    res.json(sessions)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener sesiones' })
  }
}

module.exports = { register, login, getUsers, getDeletedUsers, updateUser, deleteUser, getSessions }