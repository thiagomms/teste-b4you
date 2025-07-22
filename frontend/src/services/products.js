import api from './api';

export const productsService = {
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar produtos' };
    }
  },

  async getProduct(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar produto' };
    }
  },

  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar produto' };
    }
  },

  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar produto' };
    }
  },

  async deleteProduct(id) {
    try {
      await api.delete(`/products/${id}`);
      return { success: true };
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao excluir produto' };
    }
  }
};