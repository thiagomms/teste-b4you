import { useState } from 'react';
import { useRouter } from 'next/router';
import { productsService } from '../../services/products';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '../../components/ProductForm';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSave = async (productData) => {
    try {
      setLoading(true);
      setError(null);
      
      await productsService.createProduct(productData);
      
      setSuccess('Produto criado com sucesso!');
      
      // Redirecionar após 1.5 segundos
      setTimeout(() => {
        router.push('/');
      }, 1500);
      
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push('/')}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Novo Produto
          </h1>
          <p className="text-gray-600">
            Preencha os dados do novo produto
          </p>
        </div>
      </div>

      {/* Messages */}
      <ErrorMessage message={error} onClose={() => setError(null)} />
      <SuccessMessage message={success} onClose={() => setSuccess(null)} />

      {/* Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <ProductForm
          onSave={handleSave}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </div>
  );
}