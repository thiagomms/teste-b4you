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
    console.log('Interceptor de erro ativado:', {
      status: error.response?.status,
      url: error.config?.url,
      pathname: window.location.pathname
    });
    
    // Se erro 401 (token expirado ou inválido)
    if (error.response?.status === 401 && isClient) {
      // Verifica se já está na página de login
      const isLoginPage = window.location.pathname.includes('/login');
      
      console.log('Erro 401 detectado. Está na página de login?', isLoginPage);
      
      // Se NÃO estiver na página de login
      if (!isLoginPage) {
        console.log('Token inválido. Aguardando antes de redirecionar...');
        
        // Remove token inválido
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        
        // Aguarda 65 segundos antes de redirecionar
        // Isso dá tempo suficiente para ler a mensagem de erro
        setTimeout(() => {
          console.log('Redirecionando para login após timeout...');
          window.location.href = '/login';
        }, 65000); // 65 segundos = mesmo tempo do erro
      } else {
        console.log('Já está na página de login. Não redirecionando.');
      }
      // Se ESTIVER na página de login, NÃO faz nada
      // Apenas propaga o erro para ser tratado pelo formulário
    }
    
    // Propaga erro para tratamento específico
    return Promise.reject(error);
  }
);

export default api;