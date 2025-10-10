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

// Types for our data models based on the actual API response
export interface Person {
  PCODE: number;
  FCODE: number;
  PNAME: string;
  PBIRTH: string;
  PIDNUM: string;
  PIDNUM2: string;
  OLDIDNUM: string;
  SEX: string;
  RELATION: string;
  RELATION2: string | null;
  CRIPPLED: string;
  VINFORM: string | null;
  AGREE: string | null;
  LASTCHECK: string | null;
  PERINFO: string;
  CARDCHECK: string | null;
  JAEHAN: string | null;
  SEARCHID: string;
  PCCHECK: string | null;
  PSNIDT: string | null;
  PSNID: string | null;
  MEMO1: string | null;
  MEMO2: string | null;
}

// Updated interfaces to match the actual API response structure
export interface ApiResponse<T> {
  data: T;
  pagination?: {
    total: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// API service class
export class FirebirdApiService {
  // Persons endpoints
  static async getPersons(): Promise<{ persons: Person[]; pagination: { total: number; currentPage: number; itemsPerPage: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean } }> {
    try {
      const response = await api.get<ApiResponse<Person[]>>('/api/persons');
      return {
        persons: response.data.data,
        pagination: response.data.pagination || {
          total: 0,
          currentPage: 1,
          itemsPerPage: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
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

  static async createPerson(person: Partial<Person>): Promise<Person> {
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

  // Health check endpoint (not available on this API)
  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'Connected',
      timestamp: new Date().toISOString()
    };
  }
}

export default api;
