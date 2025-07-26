import { AlertCircle, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export default function ErrorMessage({ message, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const timeoutRef = useRef(null);
  
  useEffect(() => {
    if (message) {
      // Mostra a mensagem imediatamente
      setShowMessage(true);
      
      // Pequeno delay para criar efeito de fade-in
      const fadeTimer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      
      // Garante que a mensagem fique visível por pelo menos 3 segundos
      // antes de permitir que seja fechada automaticamente
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      return () => {
        clearTimeout(fadeTimer);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    } else {
      // Fade out antes de remover
      setIsVisible(false);
      const hideTimer = setTimeout(() => {
        setShowMessage(false);
      }, 300);
      
      return () => clearTimeout(hideTimer);
    }
  }, [message]);
  
  if (!showMessage || !message) return null;

  return (
    <div className={`
      bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-4 mb-6 shadow-sm
      transform transition-all duration-500 ease-out
      ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'}
    `}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
            Erro de autenticação
          </h3>
          <div className="mt-1 text-sm text-red-700 dark:text-red-300">
            {typeof message === 'string' 
              ? message 
              : message.error || 'Credenciais inválidas'}
          </div>
          <div className="mt-2 text-xs text-red-600 dark:text-red-400">
            Verifique se o email e senha estão corretos conforme as credenciais de teste abaixo.
          </div>
        </div>
        {onClose && (
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex rounded-md bg-red-50 dark:bg-red-900/20 p-1.5 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-red-50 dark:focus:ring-offset-gray-800 transition-colors"
              aria-label="Fechar mensagem"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}