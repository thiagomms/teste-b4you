module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        name: 'Smartphone Samsung Galaxy S24',
        description: 'Smartphone premium com câmera de 200MP e tela Dynamic AMOLED 2X',
        price: 3299.99,
        category: 'Eletrônicos',
        stock: 25,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Notebook Dell Inspiron 15',
        description: 'Notebook para uso profissional com Intel i7, 16GB RAM e SSD 512GB',
        price: 2899.00,
        category: 'Informática',
        stock: 15,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tênis Nike Air Max 270',
        description: 'Tênis esportivo com tecnologia Air Max para máximo conforto',
        price: 599.90,
        category: 'Calçados',
        stock: 50,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cafeteira Nespresso Essenza Mini',
        description: 'Cafeteira automática compacta com sistema de cápsulas',
        price: 399.00,
        category: 'Casa e Cozinha',
        stock: 30,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Livro "Clean Code" - Robert Martin',
        description: 'Guia essencial para escrever código limpo e maintível',
        price: 89.90,
        category: 'Livros',
        stock: 100,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};