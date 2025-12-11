const jwt = require('jsonwebtoken');
const { userModel } = require('../../modules/users/users-models');

function verifyRole(allowedRoles) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) return res.status(401).json({ error: 'No token provided' });

      const token = authHeader.split(' ')[1]; 
      if (!token) return res.status(401).json({ error: 'No token provided' });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await userModel.findById(decoded.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

module.exports = { verifyRole };
