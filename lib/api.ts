import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // for cookies
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Export API methods
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    return userStr ? JSON.parse(userStr) : null;
  },
  
  isAdmin: () => {
    const user = authAPI.getCurrentUser();
    return user && user.role === 'admin';
  }
};

export const productAPI = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }
};

export const cartAPI = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },
  
  addToCart: async (productId: number, quantity: number = 1) => {
    const response = await api.post('/cart', { productId, quantity });
    return response.data;
  },
  
  updateQuantity: async (productId: number, quantity: number) => {
    const response = await api.put(`/cart/${productId}`, { quantity });
    return response.data;
  },
  
  removeFromCart: async (productId: number) => {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  }
};

export const orderAPI = {
  checkout: async () => {
    const response = await api.post('/orders');
    return response.data;
  },
  
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  }
};

export const userAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  createUser: async (userData: { name: string, email: string, password: string, role?: string }) => {
    const response = await api.post('/users', userData);
    return response.data;
  }
};

// Default export
export default api;