const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authenticateToken = async(req, res, next) => {
  try{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
      // Continue, but with no user if no token
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.id);

    if(user){
      req.user = user;
    }

    next();
  } catch(error) {
    console.log('Auth error: ', error.message);
    return res.status(401).json({ message: 'Invalid token '});
  }
};

module.exports = {authenticateToken};