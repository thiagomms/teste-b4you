/**
 * ROTAS DE PRODUTOS - API RESTful
 * 
 * Este arquivo define todas as operações CRUD para produtos.
 * Todas as rotas são protegidas por autenticação JWT.
 * 
 * Padrão REST:
 * - GET    /products     - Listar produtos (com paginação)
 * - GET    /products/:id - Buscar produto específico
 * - POST   /products     - Criar novo produto
 * - PUT    /products/:id - Atualizar produto
 * - DELETE /products/:id - Excluir produto
 */

const express = require('express');
const yup = require('yup');
const { Product } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * PROTEÇÃO DE ROTAS
 * Aplica middleware de autenticação em todas as rotas deste arquivo
 * Garante que apenas usuários autenticados possam acessar produtos
 */
router.use(authMiddleware);

/**
 * ESQUEMA DE VALIDAÇÃO YUP
 * 
 * Define regras de validação para os dados do produto
 * Benefícios:
 * - Validação centralizada e reutilizável
 * - Mensagens de erro padronizadas
 * - Proteção contra dados inválidos no banco
 */
const productSchema = yup.object().shape({
  name: yup.string()
    .required('Nome é obrigatório')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
  description: yup.string().nullable(),
  price: yup.number()
    .required('Preço é obrigatório')
    .min(0, 'Preço deve ser maior ou igual a zero'),
  category: yup.string()
    .required('Categoria é obrigatória'),
  stock: yup.number()
    .integer('Estoque deve ser um número inteiro')
    .min(0, 'Estoque deve ser maior ou igual a zero')
    .default(0),
  active: yup.boolean().default(true)
});

/**
 * GET /products - Listar todos os produtos
 * 
 * Features implementadas:
 * - Paginação (page, limit)
 * - Filtro por status (active)
 * - Ordenação por data de criação
 * 
 * Query params:
 * - page: número da página (default: 1)
 * - limit: itens por página (default: 10)
 * - active: 'true', 'false' ou 'all'
 */
router.get('/', async (req, res) => {
  try {
    // Extrai parâmetros de query com valores padrão
    const { page = 1, limit = 10, active = 'true' } = req.query;
    const offset = (page - 1) * limit;
    
    // Constrói cláusula WHERE baseada no filtro active
    const whereClause = active === 'all' ? {} : { active: active === 'true' };
    
    // Busca produtos com contagem total para paginação
    const products = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']] // Mais recentes primeiro
    });
    
    // Retorna dados com metadados de paginação
    res.json({
      products: products.rows,
      pagination: {
        total: products.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(products.count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// GET /products/:id - Buscar produto por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        error: 'Produto não encontrado'
      });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// POST /products - Criar novo produto
router.post('/', async (req, res) => {
  try {
    // Validação dos dados
    const validatedData = await productSchema.validate(req.body, { abortEarly: false });
    
    const product = await Product.create(validatedData);
    
    res.status(201).json(product);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Dados de entrada inválidos',
        details: error.errors
      });
    }
    
    console.error('Erro ao criar produto:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// PUT /products/:id - Atualizar produto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validação dos dados
    const validatedData = await productSchema.validate(req.body, { abortEarly: false });
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        error: 'Produto não encontrado'
      });
    }
    
    await product.update(validatedData);
    
    res.json(product);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Dados de entrada inválidos',
        details: error.errors
      });
    }
    
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// DELETE /products/:id - Excluir produto
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        error: 'Produto não encontrado'
      });
    }
    
    await product.destroy();
    
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;