const router = require('express').Router()
const { register, login, getUsers, getDeletedUsers, updateUser, deleteUser, getSessions } = require('../controllers/auth.controller')
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware')

router.post('/register', register)
router.post('/login', login)
router.get('/users', verifyToken, verifyAdmin, getUsers)
router.get('/users/deleted', verifyToken, verifyAdmin, getDeletedUsers)
router.put('/users/:id', verifyToken, verifyAdmin, updateUser)
router.delete('/users/:id', verifyToken, verifyAdmin, deleteUser)
router.get('/sessions', verifyToken, verifyAdmin, getSessions)

module.exports = router