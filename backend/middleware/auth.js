const jwt = require('jsonwebtoken');

const SECRET_KEY = 'votre-secret-jwt-key-changez-en-production';

// Middleware pour vérifier le JWT
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

// Générer un JWT
exports.generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      login: user.login, 
      nomComplet: user.nomComplet,
      role: user.role 
    },
    SECRET_KEY,
    { expiresIn: '24h' }
  );
};