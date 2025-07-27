-- Script para criar o banco de dados MySQL
-- Execute este script no MySQL como root ou usuário com privilégios

-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS testcrud;

-- Usar o banco de dados
USE testcrud;

-- Criar usuário (opcional, se não quiser usar root)
-- CREATE USER 'b4you_user'@'localhost' IDENTIFIED BY 'senha_segura';
-- GRANT ALL PRIVILEGES ON testcrud.* TO 'b4you_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Mostrar que o banco foi criado
SHOW DATABASES LIKE 'testcrud'; 