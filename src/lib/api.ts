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

// Reservation data from MTR endpoint
export interface Reservation {
  PCODE: number;
  VISIDATE: string;
  VISITIME: string;
  PNAME: string;
  PBIRTH: string;
  AGE: string;
  PHONENUM: string;
  SEX: string;
  SERIAL: number;
  N: number;
  GUBUN: string;
  RESERVED: string;
  FIN: string;
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
      status: 'Connected',
      timestamp: new Date().toISOString()
    };
  }

  // MTR (reservation) endpoints
  static async getReservations(): Promise<Reservation[]> {
    try {
      const response = await api.get<Reservation[]>('/api/mtr');
      return response.data;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  }

  static async getReservationsByDate(yyyymmdd: string): Promise<Reservation[]> {
    try {
      const response = await api.get<Reservation[]>(`/api/mtr/date/${yyyymmdd}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reservations for date ${yyyymmdd}:`, error);
      throw error;
    }
  }

  static async createReservationForDate(
    yyyymmdd: string,
    data: { PCODE: number; VISITIME?: string; GUBUN?: string }
  ): Promise<Reservation> {
    try {
      const response = await api.post<Reservation>(`/api/mtr/date/${yyyymmdd}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(`Error creating reservation for date ${yyyymmdd}:`, error);
      throw error;
    }
  }

  static async searchReservationsByName(name: string): Promise<Reservation[]> {
    try {
      const reservations = await this.getReservations();
      return reservations.filter(reservation => 
        reservation.PNAME.toLowerCase().includes(name.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching reservations by name:', error);
      throw error;
    }
  }

  static async searchReservationsByBirthDate(birthDate: string): Promise<Reservation[]> {
    try {
      const reservations = await this.getReservations();
      return reservations.filter(reservation => 
        reservation.PBIRTH.includes(birthDate)
      );
    } catch (error) {
      console.error('Error searching reservations by birth date:', error);
      throw error;
    }
  }

  static async searchReservationsByNameForDate(name: string, yyyymmdd: string): Promise<Reservation[]> {
    try {
      const reservations = await this.getReservationsByDate(yyyymmdd);
      return reservations.filter(reservation =>
        reservation.PNAME.toLowerCase().includes(name.toLowerCase())
      );
    } catch (error) {
      console.error(`Error searching reservations by name for date ${yyyymmdd}:`, error);
      throw error;
    }
  }

  static async searchReservationsByBirthDateForDate(birthDate: string, yyyymmdd: string): Promise<Reservation[]> {
    try {
      const reservations = await this.getReservationsByDate(yyyymmdd);
      return reservations.filter(reservation => reservation.PBIRTH.includes(birthDate));
    } catch (error) {
      console.error(`Error searching reservations by birth date for date ${yyyymmdd}:`, error);
      throw error;
    }
  }
}

export default api;
