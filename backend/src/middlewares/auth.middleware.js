const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ message: 'Token requerido' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' })
  }
}

const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Acceso solo para administradores' })
  }
  next()
}

const verifyAdminOrEmployee = (req, res, next) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'EMPLOYEE') {
    return res.status(403).json({ message: 'Acceso no autorizado' })
  }
  next()
}

module.exports = { verifyToken, verifyAdmin, verifyAdminOrEmployee }