# Teste Full Stack B4You 🚀

## 📋 Sobre o Projeto

Sistema Full Stack para gerenciamento de produtos com autenticação JWT. O projeto consiste em uma API REST desenvolvida em Node.js/Express e uma aplicação frontend em Next.js/React.

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Sequelize** - ORM para banco de dados
- **MySQL/PostgreSQL** - Banco de dados (produção)
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Yup** - Validação de dados
- **Cors** - Cross-Origin Resource Sharing
- **Helmet** - Segurança HTTP


### Frontend
- **Next.js 14** - Framework React
- **React 18** - Biblioteca UI
- **Tailwind CSS** - Framework CSS
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
project/
├── backend/
│   ├── config/         # Configurações do banco de dados
│   ├── middleware/     # Middlewares (autenticação)
│   ├── models/         # Modelos Sequelize
│   ├── routes/         # Rotas da API
│   ├── seeders/        # Seeds do banco
│   └── server.js       # Arquivo principal do servidor
│
└── frontend/
    ├── src/
    │   ├── components/ # Componentes React
    │   ├── pages/      # Páginas Next.js
    │   ├── services/   # Serviços de API
    │   └── styles/     # Arquivos de estilo
    └── public/         # Arquivos públicos
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (v16 ou superior)
- npm ou yarn
- MySQL Server instalado e rodando

### 1. Clone o repositório
```bash
git clone https://github.com/thiagomms/teste-b4you.git
cd teste-b4you
```

### 2. Configuração do Banco de Dados MySQL

⚠️ **EXECUTE ESTES PASSOS PRIMEIRO PARA EVITAR ERROS!**

```bash
# 1. Crie o banco de dados no MySQL
mysql -u root -p
CREATE DATABASE testcrud;
exit;

# 2. Crie o arquivo .env na pasta backend/
cd backend
# Copie o conteúdo da seção "Configurar o arquivo .env" acima
```

### 3. Configuração do Backend

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# IMPORTANTE: Instale o driver MySQL
npm install mysql2

# Crie as tabelas (escolha uma opção):
# Opção 1: Via SQL direto
mysql -u root -p testcrud < create-table.sql

# Opção 2: Via migrations
npm run migrate

# (Opcional) Adicione dados de teste
mysql -u root -p testcrud < seed-products.sql

# Inicie o servidor
npm run dev
```

O servidor backend estará rodando em `http://localhost:3001`

### 4. Configuração do Frontend

```bash
# Em outro terminal, entre na pasta do frontend
cd ../frontend

# Instale as dependências
npm install

# Inicie a aplicação
npm run dev
```

A aplicação frontend estará disponível em `http://localhost:3000`

## 🔐 Credenciais de Login

### ⚠️ IMPORTANTE: Use estas credenciais exatas para fazer login:

```json
{
  "email": "admin@b4you.dev",
  "password": "123456"
}
```

**Observações**:
- O email deve ser exatamente: `admin@b4you.dev`
- A senha deve ser exatamente: `123456`
- Estas são as únicas credenciais válidas no sistema

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registro de novo usuário
- `POST /api/auth/login` - Login

### Produtos
- `GET /api/products` - Listar todos os produtos
- `GET /api/products/:id` - Obter produto específico
- `POST /api/products` - Criar novo produto (autenticado)
- `PUT /api/products/:id` - Atualizar produto (autenticado)
- `DELETE /api/products/:id` - Deletar produto (autenticado)

## 🗄️ Banco de Dados

### ⚠️ IMPORTANTE: Configuração do MySQL

Este projeto utiliza MySQL como banco de dados. Siga os passos abaixo **na ordem correta** para evitar erros:

#### 1️⃣ Pré-requisitos
- MySQL Server instalado e rodando
- Acesso root ou usuário com privilégios para criar banco de dados

#### 2️⃣ Criar o Banco de Dados

Execute no terminal MySQL ou em uma ferramenta como phpMyAdmin/MySQL Workbench:

```sql
-- Criar o banco de dados
CREATE DATABASE testcrud;

-- Verificar se foi criado
SHOW DATABASES LIKE 'testcrud';
```

#### 3️⃣ Configurar o arquivo .env

**IMPORTANTE**: O nome do banco no arquivo `.env` deve ser **exatamente igual** ao banco criado!

Crie um arquivo `.env` na pasta `backend/` com o seguinte conteúdo:

```env
# Configuração JWT
JWT_SECRET=b4you_secret_key_2024

# Configuração MySQL - ATENÇÃO AOS NOMES!
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=testcrud        # DEVE ser igual ao nome do banco criado
DB_USER=root
DB_PASSWORD=sua_senha_mysql  # Coloque sua senha do MySQL aqui

# Porta do servidor
PORT=3001
```

⚠️ **Erros comuns**:
- Nome do banco diferente no `.env` e no MySQL
- Senha incorreta do MySQL
- Não ter instalado o driver: `npm install mysql2`

#### 4️⃣ Criar as Tabelas

Você tem duas opções:

**Opção A - Via SQL direto (recomendado):**

Execute o arquivo SQL fornecido:
```bash
# No MySQL
mysql -u root -p testcrud < backend/create-table.sql
```

Ou copie e execute este SQL:
```sql
USE testcrud;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  active TINYINT DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
```

**Opção B - Via Sequelize migrations:**
```bash
cd backend
npm run migrate
```

#### 5️⃣ Popular com Dados de Teste (Opcional)

Execute o arquivo de seed:
```bash
mysql -u root -p testcrud < backend/seed-products.sql
```

Ou via Sequelize:
```bash
npm run seed
```

### 🔍 Verificação

Para verificar se tudo está configurado corretamente:

```sql
-- No MySQL
USE testcrud;
SHOW TABLES;
SELECT COUNT(*) FROM products;
```

### 🚨 Troubleshooting - Erros Comuns

#### Erro: "Table 'testcrud.products' doesn't exist"
- **Causa**: A tabela não foi criada
- **Solução**: Execute o passo 4 (criar tabelas)

#### Erro: "ER_ACCESS_DENIED_ERROR"
- **Causa**: Senha incorreta no .env
- **Solução**: Verifique a senha do MySQL no arquivo .env

#### Erro: "Unknown database 'testcrud'"
- **Causa**: Banco de dados não foi criado
- **Solução**: Execute o passo 2 (criar banco)

#### Erro: "ER_NO_SUCH_TABLE" mesmo após criar
- **Causa**: Nome do banco diferente no .env
- **Solução**: Verifique se DB_NAME no .env é igual ao banco criado

### Configuração por Tipo de Banco


#### MySQL
1. Instale o MySQL Server
2. Crie o banco de dados:
```sql
CREATE DATABASE database_produtos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
3. Configure as variáveis de ambiente conforme seção abaixo

#### PostgreSQL
1. Instale o PostgreSQL
2. Crie o banco de dados:
```sql
CREATE DATABASE database_produtos;
```
3. Configure as variáveis de ambiente conforme seção abaixo

### Modelo de Produto
```javascript
{
  id: INTEGER,
  name: STRING,
  description: TEXT,
  price: DECIMAL,
  category: STRING,
  stock: INTEGER,
  active: BOOLEAN,
  createdAt: DATE,
  updatedAt: DATE
}
```

### Modelo de Usuário
```javascript
{
  id: INTEGER,
  name: STRING,
  email: STRING,
  password: STRING (hash),
  createdAt: DATE,
  updatedAt: DATE
}
```

## 🔧 Variáveis de Ambiente

### Backend (.env)

#### Para SQLite (desenvolvimento)
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=seu_secret_aqui
DB_DIALECT=sqlite
```

#### Para MySQL
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=seu_secret_aqui
DB_HOST=localhost
DB_PORT=3306
DB_NAME=database_produtos
DB_USER=root
DB_PASS=sua_senha_mysql
DB_DIALECT=mysql
```

#### Para PostgreSQL
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=seu_secret_aqui
DB_HOST=localhost
DB_PORT=5432
DB_NAME=database_produtos
DB_USER=postgres
DB_PASS=sua_senha_postgres
DB_DIALECT=postgres
```

## 🏗️ Build para Produção

### Backend
```bash
npm start
```

### Frontend
```bash
npm run build
npm start
```

## 🧪 Testes

```bash
# Backend
cd project/backend
npm test

# Frontend
cd project/frontend
npm test
```

## 📝 Funcionalidades

- ✅ Cadastro e autenticação de usuários
- ✅ CRUD completo de produtos
- ✅ Validação de dados
- ✅ Proteção de rotas
- ✅ Interface responsiva
- ✅ Dark mode
- ✅ Paginação de produtos
- ✅ Busca e filtros
- ✅ Tratamento de erros
- ✅ Suporte a múltiplos bancos de dados (SQLite, MySQL, PostgreSQL)

## 🔍 Troubleshooting

### Erro de conexão com MySQL
- Verifique se o MySQL está rodando: `mysql --version`
- Confirme usuário e senha: `mysql -u root -p`
- Verifique se o banco existe: `SHOW DATABASES;`

### Erro de conexão com PostgreSQL
- Verifique se o PostgreSQL está rodando: `psql --version`
- Confirme conexão: `psql -U postgres`
- Liste bancos: `\l`

### Erro de migrations
```bash
# Reset do banco (CUIDADO: apaga todos os dados)
cd backend
npx sequelize-cli db:drop
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```