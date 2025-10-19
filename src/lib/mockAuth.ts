import { UserType, LoginCredentials, RegisterData, ProfileUpdateData, PasswordChangeData, UserRole } from '@/types/auth';
import { JWTService } from './auth/jwt';

// Mock users database
const mockUsers: UserType[] = [
  {
    id: 1,
    email: 'admin@martclinic.com',
    name: 'System Administrator',
    role: 'admin',
    phone: '+1-555-0100',
    department: 'IT',
    avatar: '',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: 2,
    email: 'doctor@martclinic.com',
    name: 'Dr. Sarah Johnson',
    role: 'doctor',
    phone: '+1-555-0101',
    department: 'Cardiology',
    avatar: '',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: 3,
    email: 'nurse@martclinic.com',
    name: 'Nurse Emily Davis',
    role: 'nurse',
    phone: '+1-555-0102',
    department: 'Emergency',
    avatar: '',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: 4,
    email: 'reception@martclinic.com',
    name: 'Receptionist Mike Wilson',
    role: 'receptionist',
    phone: '+1-555-0103',
    department: 'Front Desk',
    avatar: '',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: 5,
    email: 'patient@martclinic.com',
    name: 'John Patient',
    role: 'patient',
    phone: '+1-555-0104',
    department: '',
    avatar: '',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
    isActive: true,
  },
];

// Mock activity log
const mockActivities: any[] = [
  {
    id: 1,
    userId: 1,
    action: 'login',
    resource: 'authentication',
    resourceId: null,
    details: 'User logged in successfully',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    userId: 1,
    action: 'view',
    resource: 'patients',
    resourceId: null,
    details: 'Viewed patient list',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
  },
  {
    id: 3,
    userId: 2,
    action: 'create',
    resource: 'reservation',
    resourceId: 123,
    details: 'Created new appointment for patient',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
  },
];

// Mock authentication service
export class MockAuthService {
  private static currentUser: UserType | null = null;
  private static nextUserId = 6;

  static async login(credentials: LoginCredentials): Promise<{ user: UserType; token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => 
      u.email === credentials.email && 
      u.isActive
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Simple password check (in real app, this would be hashed)
    const validPasswords: Record<string, string> = {
      'admin@martclinic.com': 'admin123',
      'doctor@martclinic.com': 'doctor123',
      'nurse@martclinic.com': 'nurse123',
      'reception@martclinic.com': 'reception123',
      'patient@martclinic.com': 'patient123',
    };

    if (validPasswords[credentials.email] !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString();
    this.currentUser = user;

    // Generate real JWT token
    const token = JWTService.generateToken(user);

    // Log activity
    this.logActivity(user.id, 'login', 'authentication', null, 'User logged in successfully');

    return { user, token };
  }

  static async register(data: RegisterData): Promise<{ user: UserType; token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if user already exists
    if (mockUsers.find(u => u.email === data.email)) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser: UserType = {
      id: this.nextUserId++,
      email: data.email,
      name: data.name,
      role: data.role,
      phone: data.phone || '',
      department: data.department || '',
      avatar: '',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isActive: true,
    };

    mockUsers.push(newUser);
    this.currentUser = newUser;

    // Generate real JWT token
    const token = JWTService.generateToken(newUser);

    // Log activity
    this.logActivity(newUser.id, 'create', 'user', newUser.id, 'New user registered');

    return { user: newUser, token };
  }

  static async getCurrentUser(): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!this.currentUser) {
      throw new Error('No authenticated user');
    }

    return this.currentUser;
  }

  static async validateToken(token: string): Promise<UserType | null> {
    try {
      const payload = JWTService.verifyToken(token);
      if (!payload) return null;

      // Find user by ID from token
      const user = mockUsers.find(u => u.id === payload.userId);
      if (!user || !user.isActive) return null;

      return user;
    } catch (error) {
      console.error('Token validation failed:', error);
      return null;
    }
  }

  static async updateProfile(data: ProfileUpdateData): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!this.currentUser) {
      throw new Error('No authenticated user');
    }

    // Update user data
    Object.assign(this.currentUser, data);

    // Log activity
    this.logActivity(this.currentUser.id, 'update', 'profile', this.currentUser.id, 'Profile updated');

    return this.currentUser;
  }

  static async changePassword(data: PasswordChangeData): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!this.currentUser) {
      throw new Error('No authenticated user');
    }

    // In a real app, you'd verify the current password
    if (data.currentPassword !== 'current_password') {
      throw new Error('Current password is incorrect');
    }

    // Log activity
    this.logActivity(this.currentUser.id, 'update', 'password', this.currentUser.id, 'Password changed');
  }

  static async requestPasswordReset(email: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }

    // In a real app, you'd send an email
    console.log(`Password reset email sent to ${email}`);
  }

  static async resetPassword(token: string, password: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, you'd validate the token
    if (!token.startsWith('reset_token_')) {
      throw new Error('Invalid or expired reset token');
    }

    console.log(`Password reset for token ${token}`);
  }

  static async logout(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (this.currentUser) {
      this.logActivity(this.currentUser.id, 'logout', 'authentication', null, 'User logged out');
    }

    this.currentUser = null;
  }

  static async getUsers(): Promise<User[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return mockUsers.filter(user => user.isActive);
  }

  static async createUser(data: RegisterData): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (mockUsers.find(u => u.email === data.email)) {
      throw new Error('User with this email already exists');
    }

    const newUser: UserType = {
      id: this.nextUserId++,
      email: data.email,
      name: data.name,
      role: data.role,
      phone: data.phone || '',
      department: data.department || '',
      avatar: '',
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
      isActive: true,
    };

    mockUsers.push(newUser);
    this.logActivity(this.currentUser?.id || 1, 'create', 'user', newUser.id, `Created user: ${newUser.name}`);

    return newUser;
  }

  static async updateUser(id: number, data: Partial<RegisterData>): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, data);
    this.logActivity(this.currentUser?.id || 1, 'update', 'user', id, `Updated user: ${user.name}`);

    return user;
  }

  static async deleteUser(id: number): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = mockUsers[userIndex];
    mockUsers.splice(userIndex, 1);
    this.logActivity(this.currentUser?.id || 1, 'delete', 'user', id, `Deleted user: ${user.name}`);
  }

  static async toggleUserStatus(id: number): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = !user.isActive;
    this.logActivity(this.currentUser?.id || 1, 'update', 'user', id, `${user.isActive ? 'Activated' : 'Deactivated'} user: ${user.name}`);

    return user;
  }

  static async getUserActivity(userId?: number): Promise<any[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (userId) {
      return mockActivities.filter(activity => activity.userId === userId);
    }
    return mockActivities;
  }

  static async logActivity(userId: number, action: string, resource: string, resourceId?: number, details?: string): Promise<void> {
    const activity = {
      id: mockActivities.length + 1,
      userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: new Date().toISOString(),
    };

    mockActivities.unshift(activity); // Add to beginning
    mockActivities.splice(100); // Keep only last 100 activities
  }

  // Helper method to get mock users for display
  static getMockUsers(): UserType[] {
    return mockUsers;
  }

  // Helper method to get mock activities for display
  static getMockActivities(): any[] {
    return mockActivities;
  }
}
