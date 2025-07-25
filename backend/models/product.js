/**
 * MODELO DE PRODUTO - Sequelize ORM
 * 
 * Define a estrutura da tabela de produtos no banco de dados.
 * Utiliza Sequelize para abstração do banco e validações.
 * 
 * Vantagens do Sequelize:
 * - Abstração de diferentes bancos (SQLite, MySQL, PostgreSQL)
 * - Validações integradas
 * - Migrations automáticas
 * - Relacionamentos simplificados
 */

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    /**
     * CAMPO ID
     * Chave primária auto-incrementável
     * Padrão para identificação única de registros
     */
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    
    /**
     * CAMPO NOME
     * Nome do produto com validações:
     * - Obrigatório (allowNull: false)
     * - Não pode ser vazio
     * - Máximo 255 caracteres
     */
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255] // Mínimo 1, máximo 255 caracteres
      }
    },
    
    /**
     * CAMPO DESCRIÇÃO
     * Texto longo opcional para detalhes do produto
     * TEXT permite armazenar strings longas
     */
    description: {
      type: DataTypes.TEXT,
      allowNull: true // Opcional
    },
    
    /**
     * CAMPO PREÇO
     * DECIMAL(10,2) = até 10 dígitos, 2 decimais
     * Exemplo: 99999999.99
     * Validação: não pode ser negativo
     */
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0 // Preço mínimo: 0
      }
    },
    
    /**
     * CAMPO CATEGORIA
     * String obrigatória para classificação
     * Futuramente pode virar relacionamento com tabela categories
     */
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    
    /**
     * CAMPO ESTOQUE
     * Quantidade disponível em estoque
     * Integer com valor padrão 0
     * Não pode ser negativo
     */
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0 // Estoque mínimo: 0
      }
    },
    
    /**
     * CAMPO ATIVO
     * Boolean para soft delete / desativação
     * Permite "excluir" sem remover do banco
     * Útil para histórico e auditoria
     */
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    /**
     * OPÇÕES DO MODELO
     * 
     * tableName: Nome da tabela no banco
     * timestamps: Adiciona createdAt e updatedAt automaticamente
     */
    tableName: 'products',
    timestamps: true // Adiciona createdAt e updatedAt
  });

  return Product;
};