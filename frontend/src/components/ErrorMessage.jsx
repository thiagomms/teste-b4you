import { AlertCircle, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export default function ErrorMessage({ message, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [progress, setProgress] = useState(100);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const delayRef = useRef(null);
  
  // Tempo em milissegundos que o erro ficará visível (60 segundos = 1 minuto)
  const DISPLAY_TIME = 60000;
  const UPDATE_INTERVAL = 100; // Atualiza a barra a cada 100ms
  const INITIAL_DELAY = 5000; // Delay de 5 segundos antes de começar a contagem
  
  useEffect(() => {
    if (message) {
      // Mostra a mensagem imediatamente
      setShowMessage(true);
      setProgress(100);
      
      // Pequeno delay para criar efeito de fade-in
      const fadeTimer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      
      // Limpa timers anteriores
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (delayRef.current) {
        clearTimeout(delayRef.current);
      }
      
      // Espera 2 segundos antes de começar a diminuir a barra
      delayRef.current = setTimeout(() => {
        // Atualiza a barra de progresso
        let elapsed = 0;
        intervalRef.current = setInterval(() => {
          elapsed += UPDATE_INTERVAL;
          const newProgress = Math.max(0, 100 - (elapsed / DISPLAY_TIME) * 100);
          setProgress(newProgress);
          
          if (newProgress === 0) {
            clearInterval(intervalRef.current);
          }
        }, UPDATE_INTERVAL);
        
        // Auto-fechar após 15 segundos (mais o delay inicial)
        timeoutRef.current = setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, DISPLAY_TIME);
      }, INITIAL_DELAY);
      
      return () => {
        clearTimeout(fadeTimer);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        if (delayRef.current) {
          clearTimeout(delayRef.current);
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
  }, [message, onClose]);
  
  // Função para fechar manualmente e limpar os timers
  const handleClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (delayRef.current) {
      clearTimeout(delayRef.current);
    }
    if (onClose) {
      onClose();
    }
  };
  
  if (!showMessage || !message) return null;

  return (
    <div className={`
      bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-4 mb-6 shadow-lg
      transform transition-all duration-500 ease-out relative overflow-hidden
      ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'}
    `}>
      {/* Barra de progresso */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-red-200 dark:bg-red-800">
        <div 
          className="h-full bg-red-500 dark:bg-red-400 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400 animate-pulse" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-base font-bold text-red-800 dark:text-red-200">
            ⚠️ Erro de autenticação
          </h3>
          <div className="mt-2 text-sm font-medium text-red-700 dark:text-red-300">
            {typeof message === 'string' 
              ? message 
              : message.error || 'Credenciais inválidas. Por favor, verifique seu email e senha.'}
          </div>
          <div className="mt-3 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-2 rounded">
            💡 <strong>Dica:</strong> Verifique se o email e senha estão corretos conforme as credenciais de teste abaixo.
          </div>
          <div className="mt-2 text-xs text-red-500 dark:text-red-400 italic font-medium">
            {progress === 100 
              ? 'Lendo mensagem...' 
              : `Esta mensagem desaparecerá em ${Math.ceil(progress * DISPLAY_TIME / 100000)} segundos...`}
          </div>
        </div>
        {onClose && (
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className="inline-flex rounded-md bg-red-100 dark:bg-red-900/30 p-2 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-red-50 dark:focus:ring-offset-gray-800 transition-all duration-200 hover:scale-110"
              aria-label="Fechar mensagem"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}