import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage');
  if (token) {
    try {
      const parsedToken = JSON.parse(token);
      if (parsedToken.state?.token) {
        config.headers.Authorization = `Bearer ${parsedToken.state.token}`;
      }
    } catch (error) {
      console.error('Ошибка парсинга токена:', error);
    }
  }
  return config;
});

export interface Service {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  fullDescription?: string;
  category: 'bot' | 'website' | 'app' | 'service' | 'other';
  logo?: string;
  banner?: string;
  contact: {
    website?: string;
    telegram?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  pricing: string;
  tags: string[];
  status: 'active' | 'inactive' | 'pending';
  isPremium: boolean;
  views: number;
  clicks: number;
  rating: {
    average: number;
    count: number;
  };
  position: number;
  expiresAt?: string;
  owner: {
    _id: string;
    profile: {
      name: string;
      avatar?: string;
      bio?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface ServicesResponse {
  services: Service[];
}

export interface ServiceResponse {
  service: Service;
}

export const servicesAPI = {
  getServices: async (params?: {
    search?: string;
    category?: string;
    sort?: string;
  }): Promise<ServicesResponse> => {
    const response = await api.get('/services', { params });
    return response.data;
  },

  getService: async (id: string): Promise<ServiceResponse> => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  getServiceById: async (id: string): Promise<Service> => {
    const response = await api.get(`/services/${id}`);
    return response.data.service;
  },

  createService: async (serviceData: Partial<Service>): Promise<{ message: string; service: Service }> => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },

  updateService: async (id: string, serviceData: Partial<Service>): Promise<{ message: string; service: Service }> => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },

  deleteService: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },

  getMyServices: async (): Promise<ServicesResponse> => {
    const response = await api.get('/services/user/my-services');
    return response.data;
  },

  incrementClicks: async (id: string): Promise<{ message: string }> => {
    const response = await api.post(`/services/${id}/click`);
    return response.data;
  },

  updateServiceStatus: async (id: string, status: string): Promise<{ message: string; service: Service }> => {
    const response = await api.put(`/services/${id}/status`, { status });
    return response.data;
  },
}; 