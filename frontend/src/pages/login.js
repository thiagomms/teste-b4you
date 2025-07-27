/**
 * PÁGINA DE LOGIN
 * 
 * Implementa autenticação de usuários com JWT.
 * Design responsivo e acessível seguindo boas práticas.
 * 
 * Funcionalidades:
 * - Formulário controlado com React
 * - Validação e feedback de erros
 * - Loading state durante autenticação
 * - Redirecionamento automático após sucesso
 * - Limpeza de erros ao digitar
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../services/auth';
import { Package, LogIn, CheckCircle } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import Loading from '../components/Loading';
import { useTheme } from '../contexts/ThemeContext';

export default function Login() {
  const router = useRouter();
  const { isDark } = useTheme();
  
  /**
   * ESTADO DO FORMULÁRIO
   * 
   * credentials: Dados de login (email e senha)
   * loading: Controla estado durante autenticação
   * error: Armazena erros para exibição
   * success: Indica login bem-sucedido
   */
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * MONITORAR MUDANÇAS DE ROTA
   * 
   * Evita redirecionamentos indesejados quando há erro
   */
  useEffect(() => {
    const handleRouteChange = (url) => {
      console.log('Tentativa de mudança de rota para:', url);
      
      // Se houver erro ativo e não for uma navegação permitida, cancela
      if (error && !success && url !== '/login') {
        console.log('Bloqueando mudança de rota - erro ativo');
        router.events.emit('routeChangeError');
        throw 'Mudança de rota cancelada - erro ativo';
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [error, success, router]);

  /**
   * HANDLER DE MUDANÇA DE INPUT
   * 
   * Atualiza estado de forma imutável usando spread operator
   * Mantém erro visível para melhor compreensão do usuário
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value // Atualiza campo específico
    }));
    
    // IMPORTANTE: NÃO limpar o erro ao digitar
    // O erro só deve ser limpo quando:
    // 1. O usuário clica no X
    // 2. Tenta fazer login novamente
    // 3. Após o tempo de exibição (15 segundos)
  };

  /**
   * HANDLER DE SUBMISSÃO DO FORMULÁRIO
   * 
   * Processo:
   * 1. Previne comportamento padrão (recarregar página)
   * 2. Ativa loading e limpa erros
   * 3. Tenta fazer login via serviço
   * 4. Sucesso: mostra mensagem e aguarda antes de redirecionar
   * 5. Erro: exibe mensagem
   * 6. Finally: remove loading
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne reload da página
    console.log('Iniciando tentativa de login...'); // Debug
    
    setLoading(true);
    setError(null); // Limpa erro anterior
    setSuccess(false); // Limpa sucesso anterior

    try {
      await authService.login(credentials);
      console.log('Login bem-sucedido!'); // Debug
      setSuccess(true); // Marca como sucesso
      
      // Aguarda 3 segundos antes de redirecionar
      // para dar tempo de ver a mensagem de sucesso
      setTimeout(() => {
        router.push('/'); // Redireciona para página principal
      }, 3000);
    } catch (error) {
      console.log('Erro de login capturado:', error); // Debug detalhado
      console.log('Tipo do erro:', typeof error); // Debug
      console.log('Estrutura do erro:', JSON.stringify(error, null, 2)); // Debug
      
      // Garantir que o erro seja exibido corretamente
      const errorMessage = error?.response?.data?.error || 
                          error?.error || 
                          error?.message || 
                          'Erro ao fazer login. Verifique suas credenciais.';
      
      console.log('Mensagem de erro formatada:', errorMessage); // Debug
      setError({ error: errorMessage });
      
      // IMPORTANTE: Não fazer nada que possa causar reload
      // O erro deve permanecer visível por 17 segundos
    } finally {
      setLoading(false); // Remove loading independente do resultado
      console.log('Processo de login finalizado'); // Debug
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Package className="h-12 w-12 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Sistema B4You
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Faça login para acessar o sistema
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors">
          <ErrorMessage message={error} onClose={() => setError(null)} />
          <SuccessMessage 
            message={success ? "Login realizado com sucesso! Redirecionando..." : null} 
            onClose={() => setSuccess(false)} 
          />

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  disabled={loading || success}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  disabled={loading || success}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 transition-colors"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || success}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loading size="small" />
                ) : success ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Redirecionando...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Entrar
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Dica de login */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg shadow-sm transition-colors">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Credenciais de teste:
            </h4>
            <div className="text-sm space-y-1">
              <p className="text-blue-700 dark:text-blue-300">
                <span className="font-medium">Email:</span> 
                <code className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-blue-900 dark:text-blue-100 font-mono text-xs">admin@b4you.dev</code>
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                <span className="font-medium">Senha:</span> 
                <code className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-blue-900 dark:text-blue-100 font-mono text-xs">123456</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}