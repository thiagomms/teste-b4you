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
        <p className="text-gray-500 dark:text-gray-400">Produto não encontrado</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
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
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Detalhes do produto
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => router.push(`/products/${id}/edit`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </button>
          
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </button>
        </div>
      </div>

      {/* Messages */}
      <ErrorMessage message={error} onClose={() => setError(null)} />

      {/* Product Details */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-colors">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Informações do Produto
            </h2>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              product.active 
                ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' 
                : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
            }`}>
              {product.active ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>

        <div className="px-6 py-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Nome</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{product.name}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Categoria</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{product.category}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Preço</dt>
              <dd className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Estoque</dt>
              <dd className="mt-1">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  product.stock > 10 
                    ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' 
                    : product.stock > 0 
                      ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'
                      : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                }`}>
                  {product.stock} unidades
                </span>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Criado em</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {formatDate(product.createdAt)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Atualizado em</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {formatDate(product.updatedAt)}
              </dd>
            </div>
          </div>

          {product.description && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Descrição</dt>
              <dd className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                {product.description}
              </dd>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}