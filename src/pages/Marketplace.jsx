import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ViewListIcon, ViewGridIcon, SearchIcon, PlusIcon, PencilAltIcon } from '@heroicons/react/outline';

// Date de test pentru marketplace-uri
const testMarketplaces = [
  {
    id: 1,
    name: "Amazon",
    link: "https://amazon.com",
    image: "https://via.placeholder.com/300",
    priceModifier: 10,
    userId: 1
  },
  {
    id: 2,
    name: "eBay",
    link: "https://ebay.com",
    image: "https://via.placeholder.com/300",
    priceModifier: 15,
    userId: 1
  }
];

const Marketplace = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    priceModifier: 0,
    image: null
  });
  const [marketplaces, setMarketplaces] = useState([]);
  const [editingMarketplace, setEditingMarketplace] = useState(null);

  // Fetch marketplace-uri de la backend
  useEffect(() => {
    const fetchMarketplaces = async () => {
      try {
        const response = await fetch('https://localhost:7188/api/Marketplace/marketplace/1'); 
        if (!response.ok) {
          throw new Error('Eroare la încărcarea marketplace-urilor');
        }
        
        const data = await response.json();
        console.log(data);
        setMarketplaces(data);
      } catch (error) {
        console.error('Error fetching marketplaces:', error);
      }
    };

    fetchMarketplaces();
  }, []);

  // Filtrarea marketplace-urilor
  const filteredMarketplaces = useMemo(() => {
    if (!searchQuery.trim()) return marketplaces;
    return marketplaces.filter(marketplace =>
      marketplace.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, marketplaces]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingMarketplace) {
      setEditingMarketplace(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (editingMarketplace) {
      setEditingMarketplace(prev => ({
        ...prev,
        image: file
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('Name', formData.name);
      formDataToSend.append('Link', formData.link);
      formDataToSend.append('PriceModifier', formData.priceModifier);
      formDataToSend.append('UserId', '1');
      
      if (formData.image) {
        formDataToSend.append('ImageFile', formData.image);
      }

      console.log('Sending form data...');
      
      const response = await fetch("https://localhost:7188/api/marketplace/add", {
        method: "POST",
        headers: {
            'Accept': 'application/json'
        },
        body: formDataToSend
    });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Eroare:", errorText);
        alert(`Eroare la adăugare: ${errorText}`);
        return;
      }

      const newMarketplace = await response.json();
      console.log('Success:', newMarketplace);
       
      setMarketplaces(prev => [...prev, newMarketplace]);
      setShowAddForm(false);
      setFormData({ name: '', link: '', priceModifier: 0, image: null });
    } catch (error) {
      console.error("Eroare:", error);
      alert(`Eroare la adăugare: ${error.message}`);
    }
  };

  const handleEditClick = (marketplace) => {
    setEditingMarketplace({
      ...marketplace,
      existingImage: marketplace.image || null,  // Store the existing image URL
      image: null  // This will be used for any new image upload
    });
    setShowAddForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('Name', editingMarketplace.name);
      formDataToSend.append('Link', editingMarketplace.link);
      formDataToSend.append('PriceModifier', editingMarketplace.priceModifier);
      formDataToSend.append('UserId', '1');
      
      let imageToSend = null;
      
      if (editingMarketplace.image) {
        // If there's a new image selected
        imageToSend = await convertToBase64(editingMarketplace.image);
      } else if (editingMarketplace.existingImage) {
        // Use the existing image if no new one was selected
        imageToSend = editingMarketplace.existingImage;
      }

      const marketplaceDTO = {
        id: editingMarketplace.id,
        name: editingMarketplace.name,
        link: editingMarketplace.link,
        priceModifier: editingMarketplace.priceModifier,
        userId: '1',
        image: imageToSend
      };

      const response = await fetch(`https://localhost:7188/api/Marketplace/update/${editingMarketplace.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(marketplaceDTO)
      });

      if (!response.ok) {
        throw new Error('Eroare la actualizarea marketplace-ului');
      }

      // Refresh the marketplaces list
      const updatedResponse = await fetch('https://localhost:7188/api/Marketplace/marketplace/1');
      const updatedData = await updatedResponse.json();
      setMarketplaces(updatedData);

      setShowAddForm(false);
      setEditingMarketplace(null);
      alert('Marketplace actualizat cu succes!');
    } catch (error) {
      console.error('Error updating marketplace:', error);
      alert('Eroare la actualizarea marketplace-ului');
    }
  };

  console.log(filteredMarketplaces);

  return (
    <div className="space-y-6">
      {/* Header cu Căutare și Controale */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 w-full lg:w-auto">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
            <input
              type="text"
              placeholder="Caută marketplace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#232a4f] text-white placeholder-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Buton pentru adăugare marketplace */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Adaugă Marketplace</span>
          </button>

          {/* Butoane pentru modul de vizualizare */}
          <div className="flex bg-[#232a4f] rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'text-blue-300 hover:text-white'
              }`}
            >
              <ViewGridIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'text-blue-300 hover:text-white'
              }`}
            >
              <ViewListIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal pentru adăugare marketplace */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-[#232a4f] rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingMarketplace ? 'Editare Marketplace' : 'Adăugare Marketplace Nou'}
            </h2>
            <form onSubmit={editingMarketplace ? handleUpdate : handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Nume Marketplace
                </label>
                <input
                  type="text"
                  name="name"
                  value={editingMarketplace ? editingMarketplace.name : formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Link
                </label>
                <input
                  type="url"
                  name="link"
                  value={editingMarketplace ? editingMarketplace.link : formData.link}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Modificator Preț (%)
                </label>
                <input
                  type="number"
                  name="priceModifier"
                  value={editingMarketplace ? editingMarketplace.priceModifier : formData.priceModifier}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Imagine
                </label>
                <div className="space-y-2">
                  {(editingMarketplace && editingMarketplace.existingImage) && (
                    <div className="w-full h-32 bg-[#1a1f37] rounded-lg overflow-hidden">
                      <img 
                        src={editingMarketplace.existingImage} 
                        alt="Imagine curentă" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 bg-[#1a1f37] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingMarketplace(null);
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white rounded-lg transition-colors"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  {editingMarketplace ? 'Actualizare' : 'Salvează'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de marketplace-uri */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={viewMode === 'grid' 
          ? "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
          : "space-y-4"
        }
      >
        {filteredMarketplaces.map(marketplace => (
          <motion.div
            key={marketplace.id}
            className={`bg-[#232a4f] rounded-xl overflow-hidden hover:bg-[#2a325a] transition-colors ${
              viewMode === 'grid' ? '' : 'flex items-center gap-4 p-4'
            }`}
          >
            {/* Imagine marketplace */}
            <div className={`${viewMode === 'grid' ? 'aspect-video w-full' : 'w-16 h-16'} bg-[#1a1f3c] flex-shrink-0`}>
              <img
                src={marketplace.image!=="" ? marketplace.image : "https://via.placeholder.com/300x300.png?text=No+Image"}
                alt={marketplace.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Informații marketplace */}
            <div className={`${viewMode === 'grid' ? 'p-4' : 'flex-1'}`}>
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-white truncate">
                  {marketplace.name}
                </h3>
                <span className="text-sm font-medium text-blue-300 whitespace-nowrap">
                  {marketplace.priceModifier}% markup
                </span>
              </div>
              
              <div className="mt-1 flex items-center justify-between">
                <a
                  href={marketplace.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-300 hover:text-blue-400 transition-colors truncate flex-1"
                >
                  {marketplace.link}
                </a>
                <button
                  onClick={() => handleEditClick(marketplace)}
                  className="ml-2 p-2 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full hover:opacity-90 transition-opacity"
                  title="Editează marketplace"
                >
                  <PencilAltIcon className="w-5 h-5" />
                </button>
              </div>
              {/* Acțiuni */}
              {viewMode === 'list' && (
                <div className="flex gap-2">
                  <button className="p-2 text-blue-300 hover:text-white transition-colors">
                    <PencilAltIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-red-400 hover:text-red-300 transition-colors">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Marketplace;
