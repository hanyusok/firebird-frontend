'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { UserType, AuthState, LoginCredentials, RegisterData, ProfileUpdateData, PasswordChangeData, UserRole, ROLE_PERMISSIONS } from '@/types/auth';
import { ClinicApiService } from '@/lib/api';
import { AuthService } from '@/lib/auth/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  changePassword: (data: PasswordChangeData) => Promise<void>;
  refreshUser: () => Promise<void>;
  hasPermission: (permission: keyof typeof ROLE_PERMISSIONS.admin) => boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: UserType }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_CLEAR_ERROR' }
  | { type: 'AUTH_UPDATE_USER'; payload: UserType };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'AUTH_CLEAR_ERROR':
      return { ...state, error: null };
    case 'AUTH_UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Validate token locally instead of making API call
          const user = await AuthService.validateToken(token);
          if (user) {
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
          } else {
            localStorage.removeItem('auth_token');
            dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
          }
        } else {
          dispatch({ type: 'AUTH_FAILURE', payload: '' });
        }
      } catch (error) {
        localStorage.removeItem('auth_token');
        dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await ClinicApiService.login(credentials);
      
      localStorage.setItem('auth_token', response.token);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await ClinicApiService.register(data);
      
      localStorage.setItem('auth_token', response.token);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  const updateProfile = useCallback(async (data: ProfileUpdateData) => {
    try {
      const updatedUser = await ClinicApiService.updateProfile(data);
      dispatch({ type: 'AUTH_UPDATE_USER', payload: updatedUser });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Profile update failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw error;
    }
  }, []);

  const changePassword = useCallback(async (data: PasswordChangeData) => {
    try {
      await ClinicApiService.changePassword(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password change failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw error;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const user = await ClinicApiService.getCurrentUser();
      dispatch({ type: 'AUTH_UPDATE_USER', payload: user });
    } catch (error) {
      logout();
    }
  }, [logout]);

  const hasPermission = useCallback((permission: keyof typeof ROLE_PERMISSIONS.admin): boolean => {
    if (!state.user) return false;
    return ROLE_PERMISSIONS[state.user.role][permission];
  }, [state.user]);

  const clearError = useCallback(() => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
    hasPermission,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
