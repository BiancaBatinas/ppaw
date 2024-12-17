import { motion } from 'framer-motion';
import { EyeIcon, TagIcon } from '@heroicons/react/outline';

const ProductCard = ({ product, onDetails }) => {
  console.log(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-2xl bg-[#232a4f] hover:bg-[#2a325a] transition-all duration-300"
    >
      {/* Badge-uri */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {/* Badge Marketplace */}
        {product.marketplaces && product.marketplaces.length > 0 && (
          product.marketplaces.map((marketplace, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
            >
              <span className="text-white text-sm font-medium">{marketplace.name}</span>
            </motion.div>
          ))
        )}

        
      </div>

      {/* Container Imagine și Overlay */}
      <div className="relative aspect-square overflow-hidden bg-[#1a1f3c]">
      <img
        src="https://via.placeholder.com/300x300.png?text=No+Image"
        alt="No image"
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
      />

        
        {/* Overlay cu buton - vizibil doar la hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDetails(product)}
            className="px-6 py-2.5 flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-xl transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
          >
            <EyeIcon className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Vezi Detalii</span>
          </motion.button>
        </div>
      </div>

      {/* Conținut */}
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold text-white truncate">
          {product.name}
        </h3>
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-blue-300 text-sm">Preț</p>
            <p className="text-white font-semibold">${product.price}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-300 text-sm">Stoc</p>
            <p className="text-white font-semibold">{product.quantity} buc</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
