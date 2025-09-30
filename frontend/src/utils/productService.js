import api from './api';

const ProductService = {
  // Get all products with optional pagination
  getAllProducts: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/products/?page=${page}&limit=${limit}`);
      console.log("From productservice getALlProducts: ", response);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },

  // Get featured products (using highest rated products as algorithm)
  getFeaturedProducts: async (limit = 10) => {
    try {
      const response = await api.get(`/products/?ordering=-rating&limit=${limit}`);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch featured products' };
    }
  },

  // Get trending products
  getTrendingProducts: async (limit = 8) => {
    try {
      const response = await api.get(`/products/trending/?limit=${limit}`);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch trending products' };
    }
  },

  // Get best-selling products
  getBestSellersProducts: async (limit = 8) => {
    try {
      const response = await api.get(`/products/best-sellers/?limit=${limit}`);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch best-selling products' };
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}/`);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product details' };
    }
  },

  // Get products by category
  getProductsByCategory: async (categoryId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/products/?category=${categoryId}&page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products by category' };
    }
  },

  // Search products
  searchProducts: async (query, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/products/?search=${query}&page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search products' };
    }
  },

  // Get product reviews
  getProductReviews: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/reviews/`);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product reviews' };
    }
  },

  // Add product review
  addProductReview: async (productId, reviewData) => {
    try {
      const response = await api.post(`/products/${productId}/reviews/`, reviewData);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add review' };
    }
  },

  // Get product images
  getProductImages: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/images/`);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product images' };
    }
  },

  // Get main product image
  getMainProductImage: async (productId) => {
    try {
      const images = await ProductService.getProductImages(productId);
      const mainImage = images.find(image => image.is_main);
      return mainImage || (images.length > 0 ? images[0] : null);
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch main product image' };
    }
  }
};

export default ProductService;