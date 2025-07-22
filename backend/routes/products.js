const express = require('express');
const yup = require('yup');
const { Product } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Esquema de validação para produto
const productSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório').max(255, 'Nome deve ter no máximo 255 caracteres'),
  description: yup.string().nullable(),
  price: yup.number().required('Preço é obrigatório').min(0, 'Preço deve ser maior ou igual a zero'),
  category: yup.string().required('Categoria é obrigatória'),
  stock: yup.number().integer('Estoque deve ser um número inteiro').min(0, 'Estoque deve ser maior ou igual a zero').default(0),
  active: yup.boolean().default(true)
});

// GET /products - Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, active = 'true' } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = active === 'all' ? {} : { active: active === 'true' };
    
    const products = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
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