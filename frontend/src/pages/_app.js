import '../styles/globals.css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { authService } from '../services/auth';
import Layout from '../components/Layout';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticação apenas se não estiver na página de login
    if (router.pathname !== '/login') {
      const isAuthenticated = authService.isAuthenticated();
      
      if (!isAuthenticated) {
        // Aguarda um pouco antes de redirecionar
        // para não interferir com mensagens de erro
        setTimeout(() => {
          router.push('/login');
        }, 500); // Pequeno delay de 0.5 segundos
      }
    }
  }, [router.pathname]);

  return (
    <ThemeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}