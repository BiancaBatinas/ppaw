import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProductDetailsModal = ({ product, onClose, onSave, marketplaces }) => {
  const [editedProduct, setEditedProduct] = useState({
    ...product,
    marketplaceId: product.marketplaceId.toString()
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMarketplace, setSelectedMarketplace] = useState(
    marketplaces.find(m => m.id === product.marketplaceId)
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMarketplaceChange = (e) => {
    const selectedId = e.target.value;
    const selected = marketplaces.find(m => m.id === parseInt(selectedId));
    setSelectedMarketplace(selected);
    setEditedProduct(prev => ({
      ...prev,
      marketplaceId: selectedId
    }));
  };

  const handleSave = async () => {
    try {
      if (!selectedMarketplace) {
        throw new Error('Te rog selectează un marketplace valid');
      }

      const productData = {
        name: editedProduct.name,
        description: editedProduct.description,
        price: parseFloat(editedProduct.price) || 0,
        externalCode: editedProduct.externalCode,
        productId: editedProduct.productId,
        quantity: parseInt(editedProduct.quantity) || 0,
        imageURL: editedProduct.imageURL,
        userId: 1,
        isVariant: editedProduct.isVariant,
        parentProductId: editedProduct.isVariant ? parseInt(editedProduct.parentProductId) : null,
        marketplaceId: parseInt(selectedMarketplace.id),
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
        parentProduct: editedProduct.isVariant && editedProduct.parentProductId ? {
          id: parseInt(editedProduct.parentProductId)
        } : {
          id: null
        }
      };

      const response = await fetch(`https://localhost:7188/api/Product/updateProductMarket/${editedProduct.productId}/${selectedMarketplace.id}`, {
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
      onSave(updatedProduct);
      onClose();
    } catch (error) {
      console.error('Eroare la actualizarea produsului:', error);
      alert('Eroare la actualizarea produsului: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedMarketplace) {
      alert('Te rog selectează un marketplace pentru ștergere');
      return;
    }

    if (!window.confirm('Ești sigur că vrei să ștergi acest produs din ' + selectedMarketplace.name + '?')) {
      return;
    }

    try {
      const response = await fetch(`https://localhost:7188/api/Product/deleteProduct/${product.productId}/${selectedMarketplace.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Eroare la ștergerea produsului');
      }

      alert('Produsul a fost șters cu succes din ' + selectedMarketplace.name);
      onSave(null);
    } catch (error) {
      console.error('Eroare:', error);
      alert('Eroare la ștergerea produsului');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#232a4f] rounded-xl p-6 w-full max-w-2xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Detalii Produs</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Imagine produs */}
            <div className="w-full lg:w-1/3">
              <div className="aspect-square rounded-xl overflow-hidden bg-[#232a4f] shadow-lg">
                <img
                  src={product.imageURL || "https://via.placeholder.com/300x300.png?text=No+Image"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Detalii produs */}
            <div className="w-full lg:w-2/3 space-y-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Marketplace
                </label>
                <select
                  value={selectedMarketplace?.id || ''}
                  onChange={handleMarketplaceChange}
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

              {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Nume Produs
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editedProduct.name}
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
                      value={editedProduct.price}
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
                      value={editedProduct.externalCode}
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
                      value={editedProduct.quantity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      URL Imagine
                    </label>
                    <input
                      type="text"
                      name="imageURL"
                      value={editedProduct.imageURL}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Descriere
                    </label>
                    <textarea
                      name="description"
                      value={editedProduct.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="flex items-center text-sm font-medium text-gray-200">
                      <input
                        type="checkbox"
                        name="isVariant"
                        checked={editedProduct.isVariant}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Este variantă
                    </label>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl bg-[#232a4f] space-y-1">
                      <p className="text-blue-300 text-sm font-medium">Preț</p>
                      <p className="text-2xl font-bold text-white">${product.price}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#232a4f] space-y-1">
                      <p className="text-blue-300 text-sm font-medium">Cantitate</p>
                      <p className="text-2xl font-bold text-white">{product.quantity} buc</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#232a4f] space-y-1">
                      <p className="text-blue-300 text-sm font-medium">Cod Extern</p>
                      <p className="text-lg font-semibold text-white">{product.externalCode}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#232a4f] space-y-1">
                      <p className="text-blue-300 text-sm font-medium">ID Produs</p>
                      <p className="text-lg font-semibold text-white">{product.productId}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#232a4f] space-y-2">
                    <p className="text-blue-300 text-sm font-medium">Descriere</p>
                    <p className="text-white leading-relaxed">{product.description}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#232a4f] space-y-2">
                    <p className="text-blue-300 text-sm font-medium">Marketplace</p>
                    <p className="text-white">
                      {marketplaces.find(m => m.id === product.marketplaceId)?.name}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-10 flex justify-between gap-3 p-6 border-t border-white/10 bg-[#1a1f3c]">
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors text-white font-medium"
          >
            Șterge
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#232a4f] hover:bg-[#2a325a] transition-colors text-white font-medium"
            >
              Închide
            </button>
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 transition-colors text-white font-medium"
                >
                  Anulează
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-lg"
                >
                  Salvează
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-lg"
              >
                Editează
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetailsModal;
