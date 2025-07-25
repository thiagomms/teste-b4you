/**
 * ARQUIVO PRINCIPAL DO SERVIDOR - Backend API
 * 
 * Este arquivo é o ponto de entrada da aplicação backend.
 * Aqui configuramos o Express, middlewares, rotas e conexão com banco de dados.
 * 
 * Arquitetura: RESTful API com autenticação JWT
 * Stack: Node.js + Express + Sequelize + SQLite
 */

// Carrega variáveis de ambiente do arquivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');

// Importar rotas - separadas por domínio para melhor organização
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

// Inicialização do servidor Express
const app = express();
const PORT = process.env.PORT || 3001;

/**
 * MIDDLEWARES DE SEGURANÇA
 * 
 * Helmet: Adiciona vários headers HTTP para proteger contra vulnerabilidades comuns
 * CORS: Controla quais origens podem acessar a API
 */
app.use(helmet());
app.use(cors({
  // Em produção, especificar domínios permitidos. Em dev, permite localhost:3000
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:3000',
  credentials: true // Permite envio de cookies/credenciais
}));

/**
 * MIDDLEWARES PARA PARSING DE DADOS
 * 
 * express.json: Permite receber dados JSON no body das requisições
 * express.urlencoded: Permite receber dados de formulários HTML
 * limit: Proteção contra payloads muito grandes
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * MIDDLEWARE DE LOGGING (apenas desenvolvimento)
 * 
 * Registra todas as requisições para debug
 * Em produção, usar ferramentas como Winston ou Morgan
 */
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

/**
 * DEFINIÇÃO DE ROTAS
 * 
 * Organizadas por domínio/recurso
 * /auth - Autenticação (login, registro)
 * /products - CRUD de produtos
 */
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

/**
 * ROTA DE HEALTH CHECK
 * 
 * Endpoint para monitoramento da saúde da aplicação
 * Útil para ferramentas de monitoramento e load balancers
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada'
  });
});

// Middleware global de tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  
  if (res.headersSent) {
    return next(error);
  }
  
  res.status(500).json({
    error: 'Erro interno do servidor'
  });
});

// Inicialização do servidor
const startServer = async () => {
  try {
    // Conectar ao banco e sincronizar modelos
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🔗 URL da API: http://localhost:${PORT}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();