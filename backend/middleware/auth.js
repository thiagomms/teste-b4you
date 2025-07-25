/**
 * MIDDLEWARE DE AUTENTICAÇÃO JWT
 * 
 * Responsável por validar tokens JWT em rotas protegidas.
 * Implementa o padrão Bearer Token para autenticação stateless.
 * 
 * Fluxo:
 * 1. Cliente envia token no header Authorization: Bearer <token>
 * 2. Middleware valida o token
 * 3. Se válido, decodifica e adiciona dados do usuário em req.user
 * 4. Se inválido, retorna erro 401
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticação
 * 
 * @param {Request} req - Objeto de requisição Express
 * @param {Response} res - Objeto de resposta Express
 * @param {NextFunction} next - Função para prosseguir para próximo middleware
 */
const authMiddleware = (req, res, next) => {
  try {
    // Extrai o header Authorization da requisição
    const authHeader = req.headers.authorization;
    
    // Verifica se o header existe
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'Token de acesso requerido' 
      });
    }

    // Extrai o token do formato "Bearer TOKEN"
    // split(' ') separa "Bearer" do token real
    const token = authHeader.split(' ')[1];
    
    // Verifica se o token foi extraído corretamente
    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acesso requerido' 
      });
    }

    // Verifica e decodifica o token usando a chave secreta
    // Se inválido, lançará uma exceção
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adiciona os dados do usuário decodificados à requisição
    // Isso permite que rotas subsequentes acessem req.user
    req.user = decoded;
    
    // Continua para o próximo middleware/rota
    next();
  } catch (error) {
    // Tratamento específico para token expirado
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado' 
      });
    }
    
    // Qualquer outro erro (token malformado, assinatura inválida, etc)
    return res.status(401).json({ 
      error: 'Token inválido' 
    });
  }
};

module.exports = authMiddleware;