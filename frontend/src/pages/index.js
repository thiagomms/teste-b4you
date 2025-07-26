/**
 * PÁGINA PRINCIPAL - LISTA DE PRODUTOS
 * 
 * Esta é a página principal do sistema após o login.
 * Implementa a listagem de produtos com funcionalidades CRUD completas.
 * 
 * Funcionalidades:
 * - Listagem com busca em tempo real
 * - Visualização, edição e exclusão de produtos
 * - Feedback visual (loading, sucesso, erro)
 * - Navegação para criar novo produto
 * 
 * Padrões utilizados:
 * - Hooks do React (useState, useEffect)
 * - Separação de concerns (serviços em arquivo separado)
 * - Componentes reutilizáveis para UI
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { productsService } from '../services/products';
import { Plus, Search, Edit, Trash2, Eye, Package } from 'lucide-react';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

export default function Products() {
  const router = useRouter();
  
  /**
   * GERENCIAMENTO DE ESTADO
   * 
   * products: Array de produtos carregados da API
   * loading: Estado de carregamento inicial
   * error: Objeto de erro para exibir mensagens
   * success: Mensagem de sucesso temporária
   * searchTerm: Termo de busca para filtrar produtos
   * deleteLoading: ID do produto sendo excluído (para feedback visual)
   */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  /**
   * CARREGAMENTO INICIAL
   * 
   * useEffect com array vazio [] executa apenas na montagem do componente
   * Garante que produtos sejam carregados quando a página é acessada
   */
  useEffect(() => {
    loadProducts();
  }, []);

  /**
   * FUNÇÃO DE CARREGAMENTO DE PRODUTOS
   * 
   * Padrão try-catch-finally para:
   * - try: Fazer a requisição e atualizar estado
   * - catch: Capturar e exibir erros
   * - finally: Sempre remover estado de loading
   */
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsService.getProducts();
      setProducts(response.products || []);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * FUNÇÃO DE EXCLUSÃO COM CONFIRMAÇÃO
   * 
   * Implementa:
   * - Confirmação nativa do navegador
   * - Feedback visual durante exclusão
   * - Recarregamento da lista após sucesso
   * - Mensagem temporária de sucesso (3 segundos)
   */
  const handleDelete = async (product) => {
    // Confirmação antes de excluir
    if (!confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      return;
    }

    try {
      setDeleteLoading(product.id); // Feedback visual no botão
      await productsService.deleteProduct(product.id);
      setSuccess('Produto excluído com sucesso!');
      await loadProducts(); // Recarrega lista
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <Loading size="large" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Produtos</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Gerencie os produtos do sistema
          </p>
        </div>
        <button
          onClick={() => router.push('/products/new')}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Produto
        </button>
      </div>

      {/* Mensagens de feedback */}
      <SuccessMessage message={success} onClose={() => setSuccess(null)} />
      <ErrorMessage message={error} onClose={() => setError(null)} />

      {/* Barra de busca */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 transition-colors">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors"
          />
        </div>
      </div>

      {/* Tabela de produtos */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Criado em
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <Package className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
                      <p className="text-lg font-medium">Nenhum produto encontrado</p>
                      <p className="text-sm mt-1">Tente ajustar sua busca ou adicione um novo produto</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {product.description?.substring(0, 50)}
                          {product.description?.length > 50 && '...'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${
                          product.stock > 20 
                            ? 'text-green-600 dark:text-green-400' 
                            : product.stock > 0 
                            ? 'text-yellow-600 dark:text-yellow-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {product.stock}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.active
                          ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                      }`}>
                        {product.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => router.push(`/products/${product.id}`)}
                          className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => router.push(`/products/${product.id}/edit`)}
                          className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deleteLoading === product.id}
                          className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 transition-colors"
                          title="Excluir"
                        >
                          {deleteLoading === product.id ? (
                            <Loading size="small" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}