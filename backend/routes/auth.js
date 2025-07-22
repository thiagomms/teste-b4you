const express = require('express');
const jwt = require('jsonwebtoken');
const yup = require('yup');

const router = express.Router();

// Esquema de validação para login
const loginSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().required('Senha é obrigatória')
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    // Validação dos dados
    await loginSchema.validate(req.body, { abortEarly: false });
    
    const { email, password } = req.body;
    
    // Validação do usuário único permitido
    if (email !== 'admin@b4you.dev' || password !== '123456') {
      return res.status(401).json({
        error: 'Credenciais inválidas'
      });
    }
    
    // Geração do token JWT
    const token = jwt.sign(
      { 
        email: email,
        role: 'admin'
      },
      process.env.JWT_SECRET || 'b4you_secret_key_2024',
      { 
        expiresIn: '1h' // 1 hora conforme solicitado
      }
    );
    
    res.json({ 
      token: token,
      user: {
        email: email,
        role: 'admin'
      }
    });
    
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Dados de entrada inválidos',
        details: error.errors
      });
    }
    
    console.error('Erro no login:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;