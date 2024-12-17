export const mockProducts = [
  {
    productId: 1,
    productName: "Nike Air Max 2024",
    description: "Premium running shoes with advanced cushioning",
    price: 199.99,
    marketplaces: [
      {
        marketplaceId: 1,
        marketplaceName: "Amazon",
        marketplacePrice: 209.99,
        marketplaceDescription: "Latest Nike running shoes model"
      },
      {
        marketplaceId: 2,
        marketplaceName: "eBay"
      }
    ]
  },
  {
    productId: 2,
    productName: "Samsung Galaxy S24",
    description: "Latest flagship smartphone with AI features",
    price: 999.99,
    marketplaces: [
      {
        marketplaceId: 1,
        marketplaceName: "Amazon"
      }
    ]
  },
  {
    productId: 3,
    productName: "Sony WH-1000XM5",
    description: "Premium noise-cancelling headphones",
    price: 349.99,
    marketplaces: []
  },
  {
    productId: 4,
    productName: "MacBook Pro M3",
    description: "Professional laptop with M3 chip",
    price: 1499.99,
    marketplaces: [
      {
        marketplaceId: 1,
        marketplaceName: "Amazon",
        marketplacePrice: 1549.99,
        marketplaceDescription: "Latest Apple MacBook Pro"
      },
      {
        marketplaceId: 3,
        marketplaceName: "Best Buy",
        marketplacePrice: 1499.99,
        marketplaceDescription: "Apple MacBook Pro with warranty"
      }
    ]
  },
  {
    productId: 5,
    productName: "DJI Mini 4 Pro",
    description: "Compact drone with 4K camera",
    price: 759.99,
    marketplaces: []
  }
];

export const mockMarketplaces = [
  {
    id: 1,
    name: "Amazon"
  },
  {
    id: 2,
    name: "eBay"
  },
  {
    id: 3,
    name: "Best Buy"
  },
  {
    id: 4,
    name: "Walmart"
  }
];

// Simulate API calls
export const api = {
  getProducts: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProducts);
      }, 800); // Simulate network delay
    });
  },

  getMarketplaces: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMarketplaces);
      }, 500);
    });
  },

  addProductToMarketplace: (productId, marketplaceId, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "Product exported successfully" });
      }, 1000);
    });
  },

  updateProductInMarketplace: (productId, marketplaceId, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "Product updated successfully" });
      }, 1000);
    });
  }
};
