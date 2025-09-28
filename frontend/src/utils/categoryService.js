import api from './api';

const CategoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch categories' };
    }
  },

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch category details' };
    }
  },

  // Get featured categories
  getFeaturedCategories: async () => {
    try {
      const response = await api.get('/categories/featured/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch featured categories' };
    }
  }
};

export default CategoryService;