const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const { headers } = req;
  const { authorization } = headers;
  const token = authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded; 
    next(); 
  });
};

module.exports = verifyToken;
