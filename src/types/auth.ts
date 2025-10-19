export interface UserType {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  department?: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'patient';

export interface AuthState {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone?: string;
  department?: string;
  role: UserRole;
}

export interface ProfileUpdateData {
  name: string;
  phone?: string;
  department?: string;
  avatar?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserActivity {
  id: number;
  userId: number;
  action: string;
  resource: string;
  resourceId?: number;
  details?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface RolePermissions {
  canViewPatients: boolean;
  canEditPatients: boolean;
  canDeletePatients: boolean;
  canViewReservations: boolean;
  canCreateReservations: boolean;
  canEditReservations: boolean;
  canDeleteReservations: boolean;
  canViewActivity: boolean;
  canManageUsers: boolean;
  canViewSettings: boolean;
  canEditSettings: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    canViewPatients: true,
    canEditPatients: true,
    canDeletePatients: true,
    canViewReservations: true,
    canCreateReservations: true,
    canEditReservations: true,
    canDeleteReservations: true,
    canViewActivity: true,
    canManageUsers: true,
    canViewSettings: true,
    canEditSettings: true,
  },
  doctor: {
    canViewPatients: true,
    canEditPatients: true,
    canDeletePatients: false,
    canViewReservations: true,
    canCreateReservations: true,
    canEditReservations: true,
    canDeleteReservations: false,
    canViewActivity: true,
    canManageUsers: false,
    canViewSettings: true,
    canEditSettings: false,
  },
  nurse: {
    canViewPatients: true,
    canEditPatients: true,
    canDeletePatients: false,
    canViewReservations: true,
    canCreateReservations: true,
    canEditReservations: true,
    canDeleteReservations: false,
    canViewActivity: true,
    canManageUsers: false,
    canViewSettings: true,
    canEditSettings: false,
  },
  receptionist: {
    canViewPatients: true,
    canEditPatients: true,
    canDeletePatients: false,
    canViewReservations: true,
    canCreateReservations: true,
    canEditReservations: true,
    canDeleteReservations: false,
    canViewActivity: false,
    canManageUsers: false,
    canViewSettings: true,
    canEditSettings: false,
  },
  patient: {
    canViewPatients: false,
    canEditPatients: false,
    canDeletePatients: false,
    canViewReservations: true,
    canCreateReservations: true,
    canEditReservations: false,
    canDeleteReservations: false,
    canViewActivity: false,
    canManageUsers: false,
    canViewSettings: false,
    canEditSettings: false,
  },
};
