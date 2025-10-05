import axios from 'axios';

// Determine API base URL based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const api = {
  // Get all categories
  getCategories: async () => {
    const response = await apiClient.get('/api/categories');
    return response.data;
  },

  // Get packages by category with pagination
  getPackagesByCategory: async (categoryName, page = 1, pageSize = 30) => {
    const response = await apiClient.get(`/api/packages/${encodeURIComponent(categoryName)}`, {
      params: { page, page_size: pageSize }
    });
    return response.data;
  },

  // Search packages
  searchPackages: async (query, page = 1, pageSize = 30) => {
    const response = await apiClient.get('/api/search', {
      params: { q: query, page, page_size: pageSize }
    });
    return response.data;
  }
};

export default apiClient;