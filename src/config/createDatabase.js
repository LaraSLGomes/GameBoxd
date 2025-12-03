const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres'
  });

  try {
    await client.connect();
    console.log('🔄 Conectado ao PostgreSQL...');

    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [process.env.DB_NAME]
    );

    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`✅ Database "${process.env.DB_NAME}" criado com sucesso!`);
    } else {
      console.log(`ℹ️  Database "${process.env.DB_NAME}" já existe.`);
    }

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar database:', error.message);
    await client.end();
    process.exit(1);
  }
}

createDatabase();
