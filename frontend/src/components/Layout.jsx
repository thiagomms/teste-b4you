/**
 * COMPONENTE LAYOUT - Estrutura Base da Aplicação
 * 
 * Componente wrapper que fornece estrutura comum para todas as páginas.
 * Implementa header com informações do usuário e logout.
 * 
 * Responsabilidades:
 * - Verificar autenticação
 * - Exibir header com navegação
 * - Gerenciar logout
 * - Aplicar layout consistente
 * - Proteger rotas não autenticadas
 */

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { LogOut, Package, User } from 'lucide-react';

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * VERIFICAÇÃO DE AUTENTICAÇÃO
   * 
   * useEffect executa apenas no cliente (não no SSR)
   * Verifica se usuário está autenticado e redireciona se necessário
   */
  useEffect(() => {
    // Verifica autenticação apenas no cliente
    const currentUser = authService.getUser();
    setUser(currentUser);
    setIsLoading(false);

    // Proteção de rotas: redireciona para login se não autenticado
    if (!currentUser && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [router]);

  /**
   * FUNÇÃO DE LOGOUT
   * 
   * Remove token do localStorage e redireciona para login
   * Centralizada no authService para reutilização
   */
  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  /**
   * RENDERIZAÇÃO CONDICIONAL - Página de Login
   * 
   * Login tem seu próprio layout, então retornamos apenas o conteúdo
   * Evita header desnecessário na tela de autenticação
   */
  if (router.pathname === '/login') {
    return children;
  }

  /**
   * LOADING STATE
   * 
   * Evita flash de conteúdo não autenticado
   * Melhora percepção de performance
   */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  /**
   * ESTRUTURA DO LAYOUT
   * 
   * Header fixo com:
   * - Logo e nome do sistema
   * - Informações do usuário
   * - Botão de logout
   * 
   * Main content:
   * - Container responsivo
   * - Padding consistente
   */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER - Barra superior fixa */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo e título */}
            <div className="flex items-center">
              <Package className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">
                Sistema B4You
              </h1>
            </div>
            
            {/* Área do usuário */}
            <div className="flex items-center space-x-4">
              {/* Exibe email do usuário logado */}
              <div className="flex items-center text-sm text-gray-700">
                <User className="h-4 w-4 mr-1" />
                <span>{user?.email || 'Usuário'}</span>
              </div>
              
              {/* Botão de logout com hover state */}
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL - Renderiza páginas filhas */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}