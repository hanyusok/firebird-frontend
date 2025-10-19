// Configuration for development/testing
export const config = {
  // Set to true to use mock authentication for development/testing
  USE_MOCK_AUTH: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true',
  
  // API Configuration
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  
  // JWT Configuration
  JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET || 'dev-jwt-secret-change-in-production',
  
  // Mock Configuration
  MOCK_DELAY: 1000, // Simulate API delay in milliseconds
};

// Sample credentials for testing
export const SAMPLE_CREDENTIALS = {
  admin: {
    email: 'admin@martclinic.com',
    password: 'admin123',
    role: 'admin',
    name: 'System Administrator',
  },
  doctor: {
    email: 'doctor@martclinic.com',
    password: 'doctor123',
    role: 'doctor',
    name: 'Dr. Sarah Johnson',
  },
  nurse: {
    email: 'nurse@martclinic.com',
    password: 'nurse123',
    role: 'nurse',
    name: 'Nurse Emily Davis',
  },
  receptionist: {
    email: 'reception@martclinic.com',
    password: 'reception123',
    role: 'receptionist',
    name: 'Receptionist Mike Wilson',
  },
  patient: {
    email: 'patient@martclinic.com',
    password: 'patient123',
    role: 'patient',
    name: 'John Patient',
  },
};
