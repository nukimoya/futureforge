require("dotenv").config();

const { Sequelize } = require("sequelize");

// Validate required environment variables
const requiredEnvVars = ['DB_NAME', 'DB_USERNAME', 'DB_PASSWORD', 'DB_HOST'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432, // Default PostgreSQL port
    dialect: "postgres",
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,          // Maximum connections in pool
      min: 0,          // Minimum connections in pool
      acquire: 30000,  // Maximum time to get connection
      idle: 10000      // Maximum time connection can be idle
    },
    retry: {
      max: 3           // Retry failed connections 3 times
    }
  }
);

// Test the connection
// const testConnection = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('✅ Database connection established successfully');
//   } catch (error) {
//     console.error('❌ Unable to connect to database:', error.message);
//     process.exit(1);
//   }
// };

// // Call connection test
// testConnection();

// Correct export syntax
module.exports = { sequelize, Sequelize };