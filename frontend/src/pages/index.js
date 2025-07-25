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
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
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
          <h1 className="text-2xl font-bold text-gray-900">
            Produtos
          </h1>
          <p className="text-gray-600">
            Gerencie os produtos do sistema
          </p>
        </div>
        
        <button
          onClick={() => router.push('/products/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </button>
      </div>

      {/* Messages */}
      <ErrorMessage message={error} onClose={() => setError(null)} />
      <SuccessMessage message={success} onClose={() => setSuccess(null)} />

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">
              {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
            </div>
            {!searchTerm && (
              <button
                onClick={() => router.push('/products/new')}
                className="text-primary-600 hover:text-primary-700"
              >
                Cadastrar primeiro produto
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        {product.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.stock > 10 
                          ? 'bg-green-100 text-green-800' 
                          : product.stock > 0 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => router.push(`/products/${product.id}`)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/products/${product.id}/edit`)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deleteLoading === product.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Excluir"
                        >
                          {deleteLoading === product.id ? (
                            <Loading size="small" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}