import { CheckCircle, X } from 'lucide-react';

export default function SuccessMessage({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
      <div className="flex items-start">
        <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
        <div className="flex-1">
          <div className="text-sm text-green-700">
            {message}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 text-green-400 hover:text-green-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}