import axios from 'axios';

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Types for our data models
export interface Person {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

// API service class
export class FirebirdApiService {
  // Persons endpoints
  static async getPersons(): Promise<Person[]> {
    try {
      const response = await api.get<ApiResponse<Person[]>>('/api/persons');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching persons:', error);
      throw error;
    }
  }

  static async getPerson(id: number): Promise<Person> {
    try {
      const response = await api.get<ApiResponse<Person>>(`/api/persons/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching person ${id}:`, error);
      throw error;
    }
  }

  static async createPerson(person: Omit<Person, 'id' | 'created_at' | 'updated_at'>): Promise<Person> {
    try {
      const response = await api.post<ApiResponse<Person>>('/api/persons', person);
      return response.data.data;
    } catch (error) {
      console.error('Error creating person:', error);
      throw error;
    }
  }

  static async updatePerson(id: number, person: Partial<Person>): Promise<Person> {
    try {
      const response = await api.put<ApiResponse<Person>>(`/api/persons/${id}`, person);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating person ${id}:`, error);
      throw error;
    }
  }

  static async deletePerson(id: number): Promise<void> {
    try {
      await api.delete(`/api/persons/${id}`);
    } catch (error) {
      console.error(`Error deleting person ${id}:`, error);
      throw error;
    }
  }

  // Health check endpoint
  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await api.get<ApiResponse<{ status: string; timestamp: string }>>('/api/health');
      return response.data.data;
    } catch (error) {
      console.error('Error checking API health:', error);
      throw error;
    }
  }
}

export default api;
