import axios from 'axios';
import { config } from './config';

// API configuration
const API_BASE_URL = config.API_BASE_URL;

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
    // Handle the error more safely
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? String(error.message) 
      : 'Unknown error';
    const responseData = error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response
      ? error.response.data
      : null;
    
    console.error('Response error:', responseData || errorMessage);
    
    return Promise.reject(error);
  }
);

// Types for our data models based on the actual API response
export interface Person {
  PCODE: number;
  PNAME: string;
  PBIRTH: string;
  PSEX: string;
  PPHONE: string;
  PADDR: string;
  PEMAIL: string;
  PNOTE: string;
  SEARCHID: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  RCODE: number;
  PCODE: number;
  RDATE: string;
  RTIME: string;
  RSTATUS: string;
  RNOTE: string;
  createdAt: string;
  updatedAt: string;
  person?: Person;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    total: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// API service class
export class ClinicApiService {
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

  static async searchPersonsByName(pname: string): Promise<Person[]> {
    try {
      const response = await api.get<Person[]>(`/api/persons/search`, {
        params: { pname }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching persons by name:', error);
      throw error;
    }
  }

  static async searchPersonsByBirthdate(pbirth: string): Promise<Person[]> {
    try {
      const response = await api.get<Person[]>(`/api/persons/search`, {
        params: { pbirth }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching persons by birthdate:', error);
      throw error;
    }
  }

  static async searchPersonsBySearchId(searchid: string): Promise<Person[]> {
    try {
      const response = await api.get<Person[]>(`/api/persons/search`, {
        params: { searchid }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching persons by searchid:', error);
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
      status: 'API not available',
      timestamp: new Date().toISOString()
    };
  }

  // Reservations endpoints
  static async getReservations(): Promise<Reservation[]> {
    try {
      const response = await api.get<ApiResponse<Reservation[]>>('/api/reservations');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  }

  static async getReservationsByDate(date: string): Promise<Reservation[]> {
    try {
      const response = await api.get<Reservation[]>(`/api/reservations/date/${date}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reservations by date:', error);
      throw error;
    }
  }

  static async createReservation(reservation: Partial<Reservation>): Promise<Reservation> {
    try {
      const response = await api.post<ApiResponse<Reservation>>('/api/reservations', reservation);
      return response.data.data;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  static async createReservationForDate(date: string, data: { PCODE: number }): Promise<Reservation> {
    try {
      const response = await api.post<ApiResponse<Reservation>>(`/api/reservations/date/${date}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating reservation for date:', error);
      throw error;
    }
  }

  static async updateReservation(id: number, reservation: Partial<Reservation>): Promise<Reservation> {
    try {
      const response = await api.put<ApiResponse<Reservation>>(`/api/reservations/${id}`, reservation);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating reservation ${id}:`, error);
      throw error;
    }
  }

  static async deleteReservation(id: number): Promise<void> {
    try {
      await api.delete(`/api/reservations/${id}`);
    } catch (error) {
      console.error(`Error deleting reservation ${id}:`, error);
      throw error;
    }
  }
}