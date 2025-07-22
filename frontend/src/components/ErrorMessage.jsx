import { AlertCircle, X } from 'lucide-react';

export default function ErrorMessage({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Erro
          </h3>
          <div className="text-sm text-red-700 mt-1">
            {typeof message === 'string' ? message : message.error || 'Erro desconhecido'}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 text-red-400 hover:text-red-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}