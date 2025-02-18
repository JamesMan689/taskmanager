require('dotenv').config();
const express = require('express');
const {sequelize} = require('./config/database.js');
const authRoutes = require('./routes/auth.routes.js');

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);

const initializeDatabase = async () => {
  try{
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    await sequelize.sync();
    console.log('Database synchronized');
  } catch(error){
    console.error('Unable to connect to database:', error);
    process.exit(1);
  }
};

const PORT  = process.env.PORT || 5000;
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})