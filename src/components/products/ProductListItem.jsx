import { motion } from 'framer-motion';
import { TagIcon, ShoppingCartIcon } from '@heroicons/react/outline';

const ProductListItem = ({ product, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="bg-[#232a4f] hover:bg-[#2a325a] rounded-xl p-4 cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-4">
        {/* Imagine produs */}
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#1a1f3c]">
          <img
            src={product.ImageURL}
            alt={product.Name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Informații produs */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-white truncate">
              {product.Name}
            </h3>
            <span className="text-lg font-bold text-blue-300 whitespace-nowrap">
              ${product.Price}
            </span>
          </div>
          
          <div className="mt-1 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ShoppingCartIcon className="w-4 h-4 text-blue-300" />
              <span className="text-sm text-blue-300">
                {product.Quantity} in stoc
              </span>
            </div>
            
            {product.Marketplace && (
              <div className="flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-purple-300" />
                <span className="text-sm text-purple-300">
                  {product.Marketplace.Name}
                </span>
              </div>
            )}
            
            {product.Variants && product.Variants.length > 0 && (
              <span className="text-sm text-green-300">
                {product.Variants.length} variante
              </span>
            )}
          </div>
        </div>

        {/* Săgeată sau indicator pentru detalii */}
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
      </div>
    </motion.div>
  );
};

export default ProductListItem;
