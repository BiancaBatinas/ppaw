import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon, RefreshIcon } from '@heroicons/react/outline';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [marketplaces, setMarketplaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const userId = 1; // You might want to get this dynamically

      // Fetch marketplaces
      const marketplacesResponse = await fetch(
        `https://localhost:7188/api/Marketplace/marketplace/${userId}`, 
        {
          method: 'GET',
          headers: {
            'Accept': 'text/plain', // Setăm accept conform specificațiilor API
          },
        }
      );
      const marketplacesData = await marketplacesResponse.json();
      setMarketplaces(marketplacesData);

      // Fetch products
      const productsResponse = await fetch(
        `https://localhost:7188/api/Product/product/${userId}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'text/plain', // Setăm accept conform specificațiilor API
          },
        }
      );
      const productsData = await productsResponse.json();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleExport = async (name, newMarketplaceId, productId) => {
    try {
      // Find the product in the existing list
      const selectedProduct = products.find(p => p.name === name);
      if (!selectedProduct) {
        console.error("Product not found");
        return;
      }

      // Send request to API
      const response = await fetch(
        `https://localhost:7188/api/Product/addProductWithMarketplace`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*'
          },
          body: JSON.stringify({
            productId: productId.toString(), // Ensure it's a string
            currentMarketplaceId: selectedProduct.marketplaces[0]?.id || 0, // Default to 0 if no marketplace
            newMarketplaceId: Number(newMarketplaceId), // Ensure it's a number
            userId: 1 // You might want to get this dynamically
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Export result:", result);

      // Update UI to mark product as exported
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.name === name
            ? {
                ...p,
                marketplaces: [
                  ...p.marketplaces,
                  {
                    marketplaceId: newMarketplaceId,
                    marketplaceName: marketplaces.find(m => m.id === newMarketplaceId)?.name || newMarketplaceId
                  }
                ]
              }
            : p
        )
      );
    } catch (error) {
      console.error("Export error:", error);
      alert("A apărut o eroare la exportarea produsului.");
    }
  };

  const handleSave = async (productId, marketplaceId) => {
    try {
      const product = products.find(p => p.productId === productId);
      
      const response = await fetch(
        `https://localhost:7188/api/Product/updateProductMarket/${productId}/${marketplaceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: product.productName,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            externalCode: product.externalCode,
            imageURL: product.imageURL,
            // marketplaceId este transmis deja în URL, nu mai este necesar să fie inclus în body
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("A apărut o eroare la actualizarea produsului.");
      }
  
      const updatedProduct = await response.json();
      console.log("Produs actualizat:", updatedProduct);
  
      // Update UI
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.productId === productId ? { ...p, ...updatedProduct } : p
        )
      );
  
      alert("Produsul a fost actualizat cu succes!");
    } catch (error) {
      console.error(error);
      alert("A apărut o eroare la actualizarea produsului.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e, productId, field) => {
    const { value } = e.target;

    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.productId === productId
          ? { ...product, [field]: value }
          : product
      )
    );
  };
  
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes((searchTerm || '').toLowerCase())
);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pl-0"
    >
      {/* Header Section with gradient border bottom */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700">
        <div className="mx-auto px-4 py-6">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-white mb-6 flex items-center gap-3"
          >
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Product Dashboard
            </span>
          </motion.h1>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-grow max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 text-white border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchData}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              <RefreshIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Products
            </motion.button>
          </div>
        </div>
      </div>

      {/* Table Section with max width and auto margins */}
      <div className="mx-auto px-4 pb-8">
        <div className="bg-gray-800/50 rounded-xl shadow-xl backdrop-blur-sm border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-700/50 to-gray-800/50">
                  <th className="w-[300px] px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider border-b border-gray-700">
                    Product
                  </th>
                  {marketplaces.map(marketplace => (
                    <th key={marketplace.id} className="w-[400px] px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider border-b border-gray-700">
                      {marketplace.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredProducts.map((product) => (
                  <motion.tr
                    key={product.productId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.3)' }}
                    className="transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {product.productName}
                        </span>
                        <span className="text-sm text-gray-400">{product.name}</span>
                        <span className="text-lg font-medium text-green-400">${product.price}</span>
                      </div>
                    </td>
                    {marketplaces.map(marketplace => {
                      const isExported = product.marketplaces.some(m => m.id === marketplace.id && m.exported);

                      return (
                        <td key={marketplace.id} className="px-6 py-4">
                          {isExported ? (
                            <div className="exported-info">
                              <form className="product-details-form space-y-4">
                                <input
                                  type="text"
                                  className="product-input w-full px-3 py-2 bg-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-500"
                                  value={product.name}
                                  onChange={(e) => handleInputChange(e, product.productId, 'name')}

                                />
                                <input
                                  type="text"
                                  className="product-input w-full px-3 py-2 bg-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-500"
                                  value={product.description || "Fără descriere"}
                                   onChange={(e) => handleInputChange(e, product.productId, 'description')}
                                />
                                <input
                                  type="text"
                                  className="product-input w-full px-3 py-2 bg-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-500"
                                  value={product.price || "0"}

                                  onChange={(e) => handleInputChange(e, product.productId, 'price')}
                                />  
                                <button
                                  className="save-button w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-xl"
                                  onClick={() => handleSave(product.productId, marketplace.id)}
                                >
                                  Salvează
                                </button>
                              </form>
                            </div>
                          ) : (
                            <button
                              className="export-button w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-xl"
                              onClick={() => handleExport(product.name, marketplace.id, product.productId)}
                            >
                              Exporta
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
