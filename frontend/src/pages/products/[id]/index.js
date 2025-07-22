import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { productsService } from '../../../services/products';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Loading from '../../../components/Loading';
import ErrorMessage from '../../../components/ErrorMessage';

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      return;
    }

    try {
      await productsService.deleteProduct(id);
      router.push('/?success=Produto excluído com sucesso!');
    } catch (error) {
      setError(error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('pt-BR');
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="text-gray-600">
              Detalhes do produto
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => router.push(`/products/${id}/edit`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </button>
          
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </button>
        </div>
      </div>

      {/* Messages */}
      <ErrorMessage message={error} onClose={() => setError(null)} />

      {/* Product Details */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Informações do Produto
            </h2>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              product.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {product.active ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>

        <div className="px-6 py-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nome</dt>
              <dd className="mt-1 text-sm text-gray-900">{product.name}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Categoria</dt>
              <dd className="mt-1 text-sm text-gray-900">{product.category}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Preço</dt>
              <dd className="mt-1 text-sm font-bold text-gray-900">
                {formatPrice(product.price)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Estoque</dt>
              <dd className="mt-1">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  product.stock > 10 
                    ? 'bg-green-100 text-green-800' 
                    : product.stock > 0 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock} unidades
                </span>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Criado em</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(product.createdAt)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Atualizado em</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(product.updatedAt)}
              </dd>
            </div>
          </div>

          {product.description && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-2">Descrição</dt>
              <dd className="text-sm text-gray-900 bg-gray-50 p-4 rounded-md">
                {product.description}
              </dd>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}