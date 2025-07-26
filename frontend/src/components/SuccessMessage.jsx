import { CheckCircle, X } from 'lucide-react';

export default function SuccessMessage({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md p-4 mb-4">
      <div className="flex items-start">
        <CheckCircle className="h-5 w-5 text-green-400 dark:text-green-500 mr-3 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
            Sucesso
          </h3>
          <div className="text-sm text-green-700 dark:text-green-300 mt-1">
            {message}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 text-green-400 dark:text-green-500 hover:text-green-600 dark:hover:text-green-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}