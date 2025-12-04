const { Sequelize } = require('sequelize');
require('dotenv').config();

// Railway fornece DATABASE_URL, desenvolvimento usa variáveis separadas
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: process.env.NODE_ENV === 'production' ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {},
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com PostgreSQL estabelecida com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar com PostgreSQL:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };
