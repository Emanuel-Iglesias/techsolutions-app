const router = require('express').Router()
const { getAll, getDeleted, getOne, create, update, remove } = require('../controllers/task.controller')
const { verifyToken, verifyAdmin, verifyAdminOrEmployee } = require('../middlewares/auth.middleware')

router.use(verifyToken)
router.get('/', getAll)
router.get('/deleted', verifyAdmin, getDeleted)
router.get('/:id', getOne)
router.post('/', verifyAdminOrEmployee, create)
router.put('/:id', verifyAdminOrEmployee, update)
router.delete('/:id', verifyAdmin, remove)

module.exports = router