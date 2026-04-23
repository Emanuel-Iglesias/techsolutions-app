const router = require('express').Router()
const { getAll, getOne, create, update, remove } = require('../controllers/project.controller')
const { verifyToken } = require('../middlewares/auth.middleware')

router.use(verifyToken)
router.get('/', getAll)
router.get('/:id', getOne)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', remove)

module.exports = router