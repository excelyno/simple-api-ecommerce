const { admin } = require('../config/firebase');

const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized. No token provided.'
    });
  }

  const token = header.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({
      status: 'error',
      message: 'Unauthorized. Invalid token.',
      error: error.message
    });
  }
};

module.exports = authMiddleware;