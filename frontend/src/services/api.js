/**
 * CONFIGURAÇÃO DO CLIENTE HTTP - Axios
 * 
 * Este arquivo centraliza toda a comunicação com a API backend.
 * Implementa interceptadores para autenticação automática e tratamento de erros.
 * 
 * Benefícios desta abordagem:
 * - Configuração centralizada da API
 * - Autenticação automática em todas as requisições
 * - Tratamento de erros padronizado
 * - Redirecionamento automático em caso de sessão expirada
 */

import axios from 'axios';

// URL base da API - pode ser sobrescrita via variável de ambiente
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Verificação de ambiente cliente
 * 
 * Next.js executa código tanto no servidor (SSR) quanto no cliente.
 * localStorage só existe no navegador, então precisamos verificar.
 */
const isClient = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

/**
 * INSTÂNCIA AXIOS CONFIGURADA
 * 
 * Cria uma instância reutilizável do axios com configurações padrão:
 * - baseURL: URL base para todas as requisições
 * - timeout: Tempo máximo de espera (10 segundos)
 * - headers: Headers padrão (Content-Type)
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * INTERCEPTOR DE REQUEST
 * 
 * Executado antes de cada requisição ser enviada.
 * Adiciona automaticamente o token JWT no header Authorization.
 * 
 * Fluxo:
 * 1. Verifica se está no cliente (navegador)
 * 2. Busca token do localStorage
 * 3. Se existir, adiciona ao header Authorization
 */
api.interceptors.request.use(
  (config) => {
    if (isClient) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Adiciona token no formato Bearer
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // Em caso de erro na configuração da request
    return Promise.reject(error);
  }
);

/**
 * INTERCEPTOR DE RESPONSE
 * 
 * Executado após cada resposta ser recebida.
 * Trata erros globalmente, especialmente 401 (não autorizado).
 * 
 * Comportamento:
 * - 401: Remove token e redireciona para login (exceto se já estiver no login)
 * - Outros erros: Propaga para tratamento específico
 */
api.interceptors.response.use(
  // Caso de sucesso: apenas retorna a resposta
  (response) => response,
  
  // Caso de erro
  (error) => {
    // Se erro 401 (token expirado ou inválido)
    if (error.response?.status === 401 && isClient) {
      // Remove token inválido
      localStorage.removeItem('auth_token');
      
      // Só redireciona se NÃO estiver na página de login
      // Isso evita refresh desnecessário que faz a mensagem desaparecer
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    // Propaga erro para tratamento específico
    return Promise.reject(error);
  }
);

export default api;