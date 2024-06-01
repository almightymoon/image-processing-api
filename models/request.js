require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

// Create the database if it doesn't exist already
const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  dialect: 'mysql',
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
});

sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`)
  .then(() => {
    console.log('Database created or successfully connected.');
  })
  .catch(err => {
    console.error('Error creating or connecting to database:', err);
  });

// Initialize Sequelize instance with database connection details
const dbConnection = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
);

// Define the Request model
const Request = dbConnection.define('Request', {
  requestId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
  imageBase64: {
    type: DataTypes.TEXT('long')
  }
});

// Sync the model with the database
dbConnection.sync()
  .then(() => {
    console.log('Models synced with the database.');
  })
  .catch(err => {
    console.error('Error syncing models with the database:', err);
  });

module.exports = Request;
