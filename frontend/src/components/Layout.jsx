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
 * - Toggle de dark mode
 */

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { LogOut, Package, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isDark, toggleTheme } = useTheme();

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Carregando...</div>
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
   * - Toggle de dark mode
   * 
   * Main content:
   * - Container responsivo
   * - Padding consistente
   */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* HEADER - Barra superior fixa */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo e título */}
            <div className="flex items-center">
              <Package className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-3" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Sistema B4You
              </h1>
            </div>
            
            {/* Área do usuário e controles */}
            <div className="flex items-center space-x-4">
              {/* Botão de toggle dark mode */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              
              {/* Exibe email do usuário logado */}
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <User className="h-4 w-4 mr-1" />
                <span>{user?.email || 'Usuário'}</span>
              </div>
              
              {/* Botão de logout com hover state */}
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
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