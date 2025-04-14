import axios from 'axios';

// Set the base URL for all API calls
const API_BASE_URL = 'http://localhost:8000';
// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication services
export const authService = {
  login: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await api.post('/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }

    return response.data;
  },

  register: async (email: string, password: string) => {
    return api.post('/register', { email, password });
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Add auth token to requests if user is logged in
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Churn prediction service
export const churnService = {
  predictChurn: async (features: number[]) => {
    return api.post('/predict', { features });
  },

  getDashboardData: async () => {
    return api.get('/dashboard-data');
  },

  getCustomerProfile: async (customerId: string) => {
    return api.get(`/customer-profile?customer_id=${customerId}`);
  }
};

// Chatbot service
export const chatbotService = {
  sendMessage: async (query: string) => {
    return api.post('/api/chat', { query: query });
  }
};

export default api;
