/**
 * CONTEXTO DE TEMA - Dark Mode
 * 
 * Gerencia o estado global do tema (light/dark) da aplicação.
 * Persiste a preferência do usuário no localStorage.
 * Aplica classes do Tailwind CSS para dark mode.
 */

import { createContext, useContext, useEffect, useState } from 'react';

// Cria o contexto
const ThemeContext = createContext();

// Hook personalizado para usar o contexto
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
};

// Provider do contexto
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  // Carrega preferência salva ou detecta preferência do sistema
  useEffect(() => {
    // Verifica localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      // Se não houver preferência salva, detecta preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  // Aplica o tema no elemento root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Função para alternar tema
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 