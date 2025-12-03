const { sequelize } = require('./db');
const Review = require('../models/Review');

async function migrate() {
  try {
    console.log('🔄 Iniciando migrations...');
    
    await sequelize.sync({ alter: true });
    
    console.log('✅ Migrations executadas com sucesso!');
    console.log('📊 Tabela "reviews" criada/atualizada no banco de dados.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar migrations:', error.message);
    process.exit(1);
  }
}

migrate();
