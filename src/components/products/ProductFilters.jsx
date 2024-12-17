import { SearchIcon } from '@heroicons/react/outline';

const ProductFilters = ({ filters, setFilters, searchQuery, setSearchQuery }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Caută produse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
        </div>
        
        <select
          value={filters.marketplace}
          onChange={(e) => setFilters({ ...filters, marketplace: e.target.value })}
          className="bg-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Toate Marketplace-urile</option>
          {/* Opțiuni pentru marketplace-uri */}
        </select>

        <select
          value={filters.hasVariants}
          onChange={(e) => setFilters({ ...filters, hasVariants: e.target.value })}
          className="bg-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Toate Produsele</option>
          <option value="parent">Doar Produse Părinte</option>
          <option value="variant">Doar Variante</option>
        </select>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Preț min"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="w-1/2 bg-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Preț max"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="w-1/2 bg-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
