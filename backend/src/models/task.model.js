const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user.model.js');


const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isComplete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false
  }
});

Task.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Task, { foreignKey: 'userId' });    

module.exports = Task;