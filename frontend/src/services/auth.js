import api from './api';

// Verifica se estamos no navegador
const isClient = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.token && isClient) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      // NÃO fazer redirect ou reload aqui
      // Apenas propagar o erro para ser tratado pelo componente
      console.error('Erro no login:', error);
      
      // Formatar erro de forma consistente
      const errorData = error.response?.data || { error: 'Erro de conexão com o servidor' };
      throw errorData;
    }
  },

  logout() {
    if (isClient) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  },

  getToken() {
    if (!isClient) return null;
    return localStorage.getItem('auth_token');
  },

  getUser() {
    if (!isClient) return null;
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }
};