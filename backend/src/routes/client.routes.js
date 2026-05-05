const router = require('express').Router()
const { getAll, getDeleted, getAvailable, getOne, create, update, remove } = require('../controllers/client.controller')
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware')

router.use(verifyToken)
router.get('/', getAll)
router.get('/deleted', verifyAdmin, getDeleted)
router.get('/available', verifyAdmin, getAvailable)
router.get('/:id', getOne)
router.post('/', verifyAdmin, create)
router.put('/:id', verifyAdmin, update)
router.delete('/:id', verifyAdmin, remove)

module.exports = router