import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { productsService } from '../../../services/products';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '../../../components/ProductForm';
import Loading from '../../../components/Loading';
import ErrorMessage from '../../../components/ErrorMessage';
import SuccessMessage from '../../../components/SuccessMessage';

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await productsService.getProduct(id);
      setProduct(productData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (productData) => {
    try {
      setSaveLoading(true);
      setError(null);
      
      const updatedProduct = await productsService.updateProduct(id, productData);
      setProduct(updatedProduct);
      
      setSuccess('Produto atualizado com sucesso!');
      
      // Redirecionar após 1.5 segundos
      setTimeout(() => {
        router.push(`/products/${id}`);
      }, 1500);
      
    } catch (error) {
      setError(error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/products/${id}`);
  };

  if (loading) {
    return <Loading size="large" />;
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Produto não encontrado</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-primary-600 hover:text-primary-700"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push(`/products/${id}`)}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Editar Produto
          </h1>
          <p className="text-gray-600">
            {product.name}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ErrorMessage message={error} onClose={() => setError(null)} />
      <SuccessMessage message={success} onClose={() => setSuccess(null)} />

      {/* Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <ProductForm
          product={product}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={saveLoading}
        />
      </div>
    </div>
  );
}