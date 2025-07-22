require('dotenv').config();

// Configuração padrão para SQLite
const defaultConfig = {
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
};

// Configuração baseada em variáveis de ambiente
const envConfig = process.env.DB_DIALECT ? {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: false,
  dialectOptions: {
    // Para MySQL
    ...(process.env.DB_DIALECT === 'mysql' && {
      charset: 'utf8mb4'
      // Removido collate que estava causando aviso
    }),
    // Para PostgreSQL (Supabase)
    ...(process.env.DB_DIALECT === 'postgres' && {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    })
  }
} : defaultConfig;

module.exports = {
  development: envConfig,
  production: envConfig
};