const { verifyTokenService } = require('../services/tokenService');


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  console.log("Incoming token:", token);

  try {
    const decoded = verifyTokenService(token);
    console.log("Decoded payload:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};




const isAdmin = (req, res, next) => {
  // Allow both 'HR' and 'admin' roles
  if (!['admin', 'HR'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const isEmployee = (req, res, next) => {
  if (req.user.role !== 'employee') return res.status(403).json({ message: 'Employee access required' });
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isEmployee,
}

