import '../styles/globals.css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { authService } from '../services/auth';
import Layout from '../components/Layout';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticação apenas se não estiver na página de login
    if (router.pathname !== '/login') {
      if (!authService.isAuthenticated()) {
        router.push('/login');
      }
    }
  }, [router.pathname]);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}