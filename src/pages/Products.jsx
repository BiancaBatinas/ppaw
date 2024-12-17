import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ViewListIcon, ViewGridIcon, SearchIcon, PlusIcon } from '@heroicons/react/outline';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import ProductDetailsModal from '../components/products/ProductDetailsModal';

const Products = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [marketplaces, setMarketplaces] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    externalCode: '',
    productId: '',
    quantity: '',
    imageURL: '',
    marketplaceId: '',
    isVariant: false,
    parentProductId: null
  });

  const [filters, setFilters] = useState({
    marketplace: '',
    hasVariants: false,
    minPrice: '',
    maxPrice: '',
  });
  const [products, setProducts] = useState([]);

  // Fetch marketplaces
  useEffect(() => {
    const fetchMarketplaces = async () => {
      try {
        const response = await fetch('https://localhost:7188/api/Marketplace/marketplace/1');
        const data = await response.json();
        setMarketplaces(data);
      } catch (error) {
        console.error('Eroare la încărcarea marketplace-urilor:', error);
      }
    };
    fetchMarketplaces();
  }, []);

  // Funcție pentru a obține produsele de la API
  const fetchProducts = async () => {
    try {
      const productsResponse = await fetch('https://localhost:7188/api/Product/product/1', {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
        },
      });
      const data = await productsResponse.json();
      setProducts(data);
    } catch (error) {
      console.error('Eroare la încărcarea produselor:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Găsim marketplace-ul selectat din lista de marketplace-uri
      const selectedMarketplace = marketplaces.find(m => m.id === parseInt(formData.marketplaceId));
      
      if (!selectedMarketplace) {
        throw new Error('Te rog selectează un marketplace valid');
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        externalCode: formData.externalCode,
        productId: formData.productId,
        quantity: parseInt(formData.quantity) || 0,
        imageURL: formData.imageURL,
        userId: 1,
        isVariant: formData.isVariant,
        parentProductId: formData.isVariant ? parseInt(formData.parentProductId) : null,
        marketplaceId: parseInt(formData.marketplaceId),
        user: {
          id: 1
        },
        marketplace: {
          id: selectedMarketplace.id,
          name: selectedMarketplace.name,
          link: selectedMarketplace.link,
          image: selectedMarketplace.image,
          imageFile: null,
          user: {
            id: 1
          }
        },
        parentProduct: formData.isVariant && formData.parentProductId ? {
          id: parseInt(formData.parentProductId)
        } : {
          id: null
        }
      };

      console.log('Sending product data:', productData);

      const response = await fetch('https://localhost:7188/api/Product/addNewProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(errorText);
      }

      const newProduct = await response.json();
      console.log('Success:', newProduct);
      
      setProducts(prev => [...prev, newProduct]);
      setShowAddForm(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        externalCode: '',
        productId: '',
        quantity: '',
        imageURL: '',
        marketplaceId: '',
        isVariant: false,
        parentProductId: null
      });

      // Reîncarcă lista de produse
      const productsResponse = await fetch('https://localhost:7188/api/Product/product/1', {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
        },
      });
      const updatedProducts = await productsResponse.json();
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Eroare la adăugarea produsului:', error);
      alert('Eroare la adăugarea produsului: ' + error.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      externalCode: product.externalCode,
      productId: product.productId,
      quantity: product.quantity.toString(),
      imageURL: product.imageURL,
      marketplaceId: product.marketplaceId.toString(),
      isVariant: product.isVariant,
      parentProductId: product.parentProductId ? product.parentProductId.toString() : ''
    });
    setShowEditForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const selectedMarketplace = marketplaces.find(m => m.id === parseInt(formData.marketplaceId));
      
      if (!selectedMarketplace) {
        throw new Error('Te rog selectează un marketplace valid');
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        externalCode: formData.externalCode,
        productId: formData.productId,
        quantity: parseInt(formData.quantity) || 0,
        imageURL: formData.imageURL,
        userId: 1,
        isVariant: formData.isVariant,
        parentProductId: formData.isVariant ? parseInt(formData.parentProductId) : null,
        marketplaceId: parseInt(formData.marketplaceId),
        user: {
          id: 1
        },
        marketplace: {
          id: selectedMarketplace.id,
          name: selectedMarketplace.name,
          link: selectedMarketplace.link,
          image: selectedMarketplace.image,
          imageFile: null,
          user: {
            id: 1
          }
        },
        parentProduct: formData.isVariant && formData.parentProductId ? {
          id: parseInt(formData.parentProductId)
        } : {
          id: null
        }
      };

      const response = await fetch(`https://localhost:7188/api/Product/updateProductMarket/${formData.productId}/${formData.marketplaceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const updatedProduct = await response.json();
      
      // Actualizăm lista de produse
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.productId === updatedProduct.productId ? updatedProduct : p
        )
      );

      setShowEditForm(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        externalCode: '',
        productId: '',
        quantity: '',
        imageURL: '',
        marketplaceId: '',
        isVariant: false,
        parentProductId: null
      });

    } catch (error) {
      console.error('Eroare la actualizarea produsului:', error);
      alert('Eroare la actualizarea produsului: ' + error.message);
    }
  };

  // Filtrarea produselor
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const searchLower = searchQuery.toLowerCase();
      return (
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.productId?.toLowerCase().includes(searchLower) ||
        product.externalCode?.toLowerCase().includes(searchLower)
      );
    }).filter(product => {
      if (!filters.marketplace) return true;
      return product.marketplaceId === parseInt(filters.marketplace);
    });
  }, [products, searchQuery, filters]);

  return (
    <div className="space-y-6">
      {/* Bara de căutare și filtre */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Caută după nume, ID produs, cod extern sau descriere..."
              className="w-full px-4 py-2 bg-[#1a1f37] text-white rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex gap-4">
          <select
            value={filters.marketplace || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, marketplace: e.target.value }))}
            className="px-4 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toate Marketplace-urile</option>
            {marketplaces.map(marketplace => (
              <option key={marketplace.id} value={marketplace.id}>
                {marketplace.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Adaugă Produs
          </button>
        </div>
      </div>

      {/* Modal pentru adăugare produs */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#232a4f] rounded-xl p-6 w-full max-w-2xl"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Adaugă Produs Nou</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Nume Produs
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Preț
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Cod Extern
                  </label>
                  <input
                    type="text"
                    name="externalCode"
                    value={formData.externalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    ID Produs
                  </label>
                  <input
                    type="text"
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Cantitate
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    URL/Link Imagine
                  </label>
                  <input
                    type="text"
                    name="imageURL"
                    value={formData.imageURL}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Marketplace
                  </label>
                  <select
                    name="marketplaceId"
                    value={formData.marketplaceId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    
                  >
                    <option value="">Selectează marketplace</option>
                    {marketplaces.map(marketplace => (
                      <option key={marketplace.id} value={marketplace.id}>
                        {marketplace.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Descriere
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>

                <div className="col-span-2 flex items-center">
                  <input
                    type="checkbox"
                    name="isVariant"
                    checked={formData.isVariant}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-200">
                    Este variantă
                  </label>
                </div>

                {formData.isVariant && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Produs Părinte
                    </label>
                    <select
                      name="parentProductId"
                      value={formData.parentProductId || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={formData.isVariant}
                    >
                      <option value="">Selectează produsul părinte</option>
                      {products
                        .filter(p => !p.isVariant)
                        .map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      externalCode: '',
                      productId: '',
                      quantity: '',
                      imageURL: '',
                      marketplaceId: '',
                      isVariant: false,
                      parentProductId: null
                    });
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white rounded-lg transition-colors"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Salvează
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal pentru editare produs */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#232a4f] rounded-xl p-6 w-full max-w-2xl"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Editează Produs</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Nume Produs
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Preț
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Cod Extern
                  </label>
                  <input
                    type="text"
                    name="externalCode"
                    value={formData.externalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    ID Produs
                  </label>
                  <input
                    type="text"
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Cantitate
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    URL/Link Imagine
                  </label>
                  <input
                    type="text"
                    name="imageURL"
                    value={formData.imageURL}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Marketplace
                  </label>
                  <select
                    name="marketplaceId"
                    value={formData.marketplaceId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    
                  >
                    <option value="">Selectează marketplace</option>
                    {marketplaces.map(marketplace => (
                      <option key={marketplace.id} value={marketplace.id}>
                        {marketplace.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Descriere
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>

                <div className="col-span-2 flex items-center">
                  <input
                    type="checkbox"
                    name="isVariant"
                    checked={formData.isVariant}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-200">
                    Este variantă
                  </label>
                </div>

                {formData.isVariant && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Produs Părinte
                    </label>
                    <select
                      name="parentProductId"
                      value={formData.parentProductId || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={formData.isVariant}
                    >
                      <option value="">Selectează produsul părinte</option>
                      {products
                        .filter(p => !p.isVariant)
                        .map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingProduct(null);
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      externalCode: '',
                      productId: '',
                      quantity: '',
                      imageURL: '',
                      marketplaceId: '',
                      isVariant: false,
                      parentProductId: null
                    });
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white rounded-lg transition-colors"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Salvează
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Filtre */}
      <ProductFilters
        filters={filters}
        setFilters={setFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Lista de produse */}
      {viewMode === 'grid' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
        >
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onDetails={setSelectedProduct}
              onEdit={handleEdit}
            />
          ))}
        </motion.div>
      ) : (
        <div className="mt-6 space-y-2">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#232a4f] hover:bg-[#2a325a] rounded-xl p-4 cursor-pointer transition-colors"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="flex items-center gap-4">
                {/* Imagine produs */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#1a1f3c]">
                  <img
                    src={product.imageURL}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Informații produs */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {product.name}
                    </h3>
                    <span className="text-lg font-bold text-blue-300 whitespace-nowrap">
                      ${product.price}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-blue-300">
                        {product.quantity} in stoc
                      </span>
                    </div>

                    {product.marketplaces && product.marketplaces.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-purple-300">
                          {product.marketplaces[0].name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Săgeată pentru detalii */}
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#1a1f3c] flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                {/* Buton pentru editare */}
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#1a1f3c] flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(product);
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Detalii */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSave={(updatedProduct) => {
            if (updatedProduct === null) {
              // Produsul a fost șters
              setSelectedProduct(null); // Închide dialogul
              fetchProducts(); // Reîmprospătează lista
            } else {
              // Produsul a fost actualizat
              setProducts(prevProducts =>
                prevProducts.map(p =>
                  p.id === updatedProduct.id ? updatedProduct : p
                )
              );
              setSelectedProduct(null);
            }
          }}
          marketplaces={marketplaces}
        />
      )}
    </div>
  );
};

export default Products;
