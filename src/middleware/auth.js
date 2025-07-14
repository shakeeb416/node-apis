require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    console.log(JWT_SECRET , token);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded , "CHECK THIS");
    req.user = decoded; // { userId }
    next();
  } catch (err) {

    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = auth;
