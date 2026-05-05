const prisma = require('../prisma')

const getLogs = async (req, res) => {
  try {
    const logs = await prisma.changeLog.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    })
    res.json(logs)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial' })
  }
}

module.exports = { getLogs }