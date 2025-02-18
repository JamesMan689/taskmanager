const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

require('dotenv').config();

const router = express.Router();

// register route
router.post('/register', async(req, res) => {
  try{
    const{ username, password } = req.body;
    const user = await User.create({
      username,
      password
    });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Registration successful',
      token
    });
  } catch(error){
    // username already taken
    if(error.name === 'SequelizeUniqueConstraintError'){
      return res.status(400).json({ message: 'Username already exists' });
    }

    res.status(500).json({ message: 'Error creating user' });
  }
})

// login route
router.post('/login', async(req, res) => {
  try{
    const { username, password } = req.body;

    // check username and password
    const user = await User.findOne({ where: { username }});
    if(!user){
      return res.status(500).json({ message: 'User not found' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword){
      return res.status(500).json({ message: 'Invalid password' });
    }

    const token =  jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Logged in',
      token
    });
  } catch(error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;