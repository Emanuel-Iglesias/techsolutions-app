const router = require('express').Router()
const { register, login, getUsers, getDeletedUsers, updateUser, deleteUser, getSessions } = require('../controllers/auth.controller')
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware')
const prisma = require('../prisma')

router.post('/register', register)
router.post('/login', login)
router.get('/users', verifyToken, verifyAdmin, getUsers)
router.get('/users/deleted', verifyToken, verifyAdmin, getDeletedUsers)
router.put('/users/:id', verifyToken, verifyAdmin, updateUser)
router.delete('/users/:id', verifyToken, verifyAdmin, deleteUser)
router.get('/sessions', verifyToken, verifyAdmin, getSessions)
router.get('/employees', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const employees = await prisma.user.findMany({
      where: { role: 'EMPLOYEE', deletedAt: null },
      select: { id: true, name: true, email: true, role: true }
    })
    res.json(employees)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener empleados' })
  }
})

module.exports = router