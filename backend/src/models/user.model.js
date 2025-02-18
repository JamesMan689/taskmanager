const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * Create User table in database
 * Sequelize used for writing SQL code in JavaScript
 */
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: true
  },
  password: DataTypes.STRING
}, {
  hooks: {
    // encrypts the password using bcrypt
    beforeCreate: async(user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }
});

module.exports = User;