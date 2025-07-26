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

### 1. Clone o repositório
```bash
git clone https://github.com/thiagomms/teste-b4you.git
cd teste-b4you
```

### 2. Configuração do Backend

```bash
# Entre na pasta do backend
cd project/backend

# Instale as dependências
npm install

# Se for usar MySQL, instale também:
# npm install mysql2

# Se for usar PostgreSQL, instale:
# npm install pg pg-hstore

# Configure as variáveis de ambiente
# Crie um arquivo .env baseado no env-example.txt
cp env-example.txt .env

# Execute as migrations
npm run migrate

# Execute os seeders (dados iniciais)
npm run seed

# Inicie o servidor
npm run dev
```

O servidor backend estará rodando em `http://localhost:3000`

### 3. Configuração do Frontend

```bash
# Em outro terminal, entre na pasta do frontend
cd project/frontend

# Instale as dependências
npm install

# Inicie a aplicação
npm run dev
```

A aplicação frontend estará disponível em `http://localhost:3001`

## 🔐 Autenticação

O sistema utiliza autenticação JWT. Para acessar as rotas protegidas:

1. Faça login através do endpoint `/api/auth/login`
2. Use o token retornado no header `Authorization: Bearer <token>`

### Credenciais de teste
```json
{
  "email": "admin@b4you.dev",
  "password": "123456"
}
```

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