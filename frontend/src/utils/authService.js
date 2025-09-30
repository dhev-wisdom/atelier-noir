import api from './api';

const AuthService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/register/', userData);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user and store tokens
  login: async (credentials) => {
    try {
      const response = await api.post('/login/', credentials);
      if (response.access && response.refresh) {
        localStorage.setItem('accessToken', response.access);
        localStorage.setItem('refreshToken', response.refresh);
        localStorage.setItem('user', JSON.stringify(response.user || {}));
      }
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },
  
  // Login with admin credentials (for testing)
  loginAsAdmin: async () => {
    try {
      const adminCredentials = {
        email: 'admin@example.com',
        password: 'StrongPassword123'
      };
      const response = await api.post('/login/', adminCredentials);
      if (response.access && response.refresh) {
        localStorage.setItem('accessToken', response.access);
        localStorage.setItem('refreshToken', response.refresh);
        localStorage.setItem('user', JSON.stringify(response.user || {}));
      }
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Admin login failed' };
    }
  },

  // Logout user and remove tokens
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Get current user info
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/users/profile/');
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user profile' };
    }
  }
};

export default AuthService;