import axios from 'axios';
import { UserType, LoginCredentials, RegisterData, ProfileUpdateData, PasswordChangeData, UserActivity } from '@/types/auth';
import { config } from './config';
import { MockAuthService } from './mockAuth';

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

// Request interceptor for logging and auth token
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
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
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/auth/signin';
    }
    
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

  // Authentication endpoints
  static async login(credentials: LoginCredentials): Promise<{ user: UserType; token: string }> {
    if (config.USE_MOCK_AUTH) {
      return MockAuthService.login(credentials);
    }
    
    try {
      const response = await api.post<{ user: UserType; token: string }>('/api/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  static async register(data: RegisterData): Promise<{ user: UserType; token: string }> {
    if (config.USE_MOCK_AUTH) {
      return MockAuthService.register(data);
    }
    
    try {
      const response = await api.post<{ user: UserType; token: string }>('/api/auth/register', data);
      return response.data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User> {
    if (config.USE_MOCK_AUTH) {
      return MockAuthService.getCurrentUser();
    }
    
    try {
      const response = await api.get<{ user: UserType }>('/api/auth/me');
      return response.data.user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }

  static async updateProfile(data: ProfileUpdateData): Promise<User> {
    if (config.USE_MOCK_AUTH) {
      return MockAuthService.updateProfile(data);
    }
    
    try {
      const response = await api.put<{ user: UserType }>('/api/auth/profile', data);
      return response.data.user;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  static async changePassword(data: PasswordChangeData): Promise<void> {
    if (config.USE_MOCK_AUTH) {
      return MockAuthService.changePassword(data);
    }
    
    try {
      await api.put('/api/auth/password', data);
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  static async requestPasswordReset(email: string): Promise<void> {
    if (config.USE_MOCK_AUTH) {
      return MockAuthService.requestPasswordReset(email);
    }
    
    try {
      await api.post('/api/auth/forgot-password', { email });
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  }

  static async resetPassword(token: string, password: string): Promise<void> {
    if (config.USE_MOCK_AUTH) {
      return MockAuthService.resetPassword(token, password);
    }
    
    try {
      await api.post('/api/auth/reset-password', { token, password });
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    if (config.USE_MOCK_AUTH) {
      return MockAuthService.logout();
    }
    
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Error logging out:', error);
      // Don't throw error for logout
    }
  }

  // User management endpoints (admin only)
  static async getUsers(): Promise<User[]> {
    if (config.USE_MOCK_AUTH) {
      return MockAuthService.getUsers();
    }
    
    try {
      const response = await api.get<{ users: UserType[] }>('/api/users');
      return response.data.users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async createUser(data: RegisterData): Promise<User> {
    if (config.USE_MOCK_AUTH) {
      return MockAuthService.createUser(data);
    }
    
    try {
      const response = await api.post<{ user: UserType }>('/api/users', data);
      return response.data.user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updateUser(id: number, data: Partial<RegisterData>): Promise<User> {
    if (config.USE_MOCK_AUTH) {
      return MockAuthService.updateUser(id, data);
    }
    
    try {
      const response = await api.put<{ user: UserType }>(`/api/users/${id}`, data);
      return response.data.user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async deleteUser(id: number): Promise<void> {
    if (config.USE_MOCK_AUTH) {
      return MockAuthService.deleteUser(id);
    }
    
    try {
      await api.delete(`/api/users/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  static async toggleUserStatus(id: number): Promise<User> {
    if (config.USE_MOCK_AUTH) {
      return MockAuthService.toggleUserStatus(id);
    }
    
    try {
      const response = await api.patch<{ user: UserType }>(`/api/users/${id}/toggle-status`);
      return response.data.user;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  }

  // Activity logging
  static async getUserActivity(userId?: number): Promise<UserActivity[]> {
    if (config.USE_MOCK_AUTH) {
      return MockAuthService.getUserActivity(userId);
    }
    
    try {
      const url = userId ? `/api/activity/user/${userId}` : '/api/activity';
      const response = await api.get<{ activities: UserActivity[] }>(url);
      return response.data.activities;
    } catch (error) {
      console.error('Error fetching user activity:', error);
      throw error;
    }
  }

  static async logActivity(action: string, resource: string, resourceId?: number, details?: string): Promise<void> {
    if (config.USE_MOCK_AUTH) {
      // Get current user ID from localStorage token
      const token = localStorage.getItem('auth_token');
      const userId = token ? parseInt(token.split('_')[2]) : 1;
      return MockAuthService.logActivity(userId, action, resource, resourceId, details);
    }
    
    try {
      await api.post('/api/activity', {
        action,
        resource,
        resourceId,
        details,
      });
    } catch (error) {
      console.error('Error logging activity:', error);
      // Don't throw error for activity logging
    }
  }
}

export default api;
