require('dotenv').config();
const express = require('express');
// MUDANÇA 1: Importamos 'sequelize' além do 'testConnection'
const { sequelize, testConnection } = require('./src/config/db'); 
const reviewRoutes = require('./src/routes/reviewRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Configuração de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'Review Service',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/reviews', reviewRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

async function startServer() {
  try {
    // 1. Testa a conexão
    await testConnection();
    
    // MUDANÇA 2: Cria as tabelas se elas não existirem!
    // Isso é essencial para o primeiro deploy no Railway
    console.log('🔄 Sincronizando tabelas do banco de dados...');
    await sequelize.sync(); 
    console.log('✅ Tabelas sincronizadas!');
    
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log(`🚀 Review Service rodando na porta ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
      // O log abaixo ajuda a ver se a variável do Railway está sendo lida certa
      console.log(`🎮 Game Service URL: ${process.env.GAME_SERVICE_URL}`); 
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('❌ Falha ao iniciar o servidor:', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;