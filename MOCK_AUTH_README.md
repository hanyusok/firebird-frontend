# Mock Authentication System for Development

This document explains how to use the mock authentication system for development and testing purposes.

## 🚀 Quick Start

The mock authentication system is **automatically enabled** in development mode. No additional setup is required!

## 📋 Sample Credentials

The system comes with pre-configured test accounts for all user roles:

### Administrator
- **Email**: `admin@martclinic.com`
- **Password**: `admin123`
- **Role**: Admin
- **Name**: System Administrator

### Doctor
- **Email**: `doctor@martclinic.com`
- **Password**: `doctor123`
- **Role**: Doctor
- **Name**: Dr. Sarah Johnson

### Nurse
- **Email**: `nurse@martclinic.com`
- **Password**: `nurse123`
- **Role**: Nurse
- **Name**: Nurse Emily Davis

### Receptionist
- **Email**: `reception@martclinic.com`
- **Password**: `reception123`
- **Role**: Receptionist
- **Name**: Receptionist Mike Wilson

### Patient
- **Email**: `patient@martclinic.com`
- **Password**: `patient123`
- **Role**: Patient
- **Name**: John Patient

## 🧪 Development Features

### Dev Credentials Widget
- A floating widget appears in the bottom-right corner during development
- Shows all sample credentials with copy-to-clipboard functionality
- Toggle password visibility with the eye icon
- Only visible in development mode

### Mock Data
- Pre-populated with sample users and activities
- Simulates API delays for realistic testing
- Persistent during the session (resets on page refresh)
- Activity logging works with mock data

## 🔧 Configuration

### Enable/Disable Mock Auth
Edit `src/lib/config.ts`:

```typescript
export const config = {
  // Set to true to use mock authentication
  USE_MOCK_AUTH: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true',
  // ... other config
};
```

### Environment Variables
You can also control mock auth with environment variables:

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_AUTH=true  # Force enable mock auth
NEXT_PUBLIC_USE_MOCK_AUTH=false # Force disable mock auth
```

## 🎯 Testing Different Roles

### Admin Testing
1. Sign in with `admin@martclinic.com` / `admin123`
2. Access all features including user management
3. Test role-based navigation and permissions

### Doctor Testing
1. Sign in with `doctor@martclinic.com` / `doctor123`
2. Test patient management and reservations
3. Verify limited access to admin features

### Nurse Testing
1. Sign in with `nurse@martclinic.com` / `nurse123`
2. Test patient care features
3. Verify appropriate permissions

### Receptionist Testing
1. Sign in with `reception@martclinic.com` / `reception123`
2. Test appointment management
3. Verify front-desk specific features

### Patient Testing
1. Sign in with `patient@martclinic.com` / `patient123`
2. Test patient-specific features
3. Verify limited access to staff features

## 🔄 Switching to Real API

When you're ready to connect to a real backend:

1. **Disable Mock Auth**:
   ```typescript
   // In src/lib/config.ts
   USE_MOCK_AUTH: false
   ```

2. **Set API URL**:
   ```bash
   # .env.local
   NEXT_PUBLIC_API_URL=http://your-api-server.com
   ```

3. **Ensure Backend Endpoints**:
   - `POST /api/auth/login`
   - `POST /api/auth/register`
   - `GET /api/auth/me`
   - `PUT /api/auth/profile`
   - `PUT /api/auth/password`
   - `POST /api/auth/forgot-password`
   - `POST /api/auth/reset-password`
   - `POST /api/auth/logout`
   - `GET /api/users`
   - `POST /api/users`
   - `PUT /api/users/:id`
   - `DELETE /api/users/:id`
   - `PATCH /api/users/:id/toggle-status`
   - `GET /api/activity`
   - `POST /api/activity`

## 🐛 Troubleshooting

### Mock Auth Not Working
- Check that `NODE_ENV=development`
- Verify `USE_MOCK_AUTH` is `true` in config
- Clear browser localStorage and refresh

### Credentials Not Working
- Ensure you're using the exact email/password combinations
- Check browser console for error messages
- Try refreshing the page

### Dev Widget Not Showing
- Ensure you're in development mode
- Check that the component is imported in layout.tsx
- Verify the component is not hidden by CSS

## 📝 Mock Data Structure

The mock system includes:
- 5 pre-configured users (one for each role)
- Sample activity logs
- Simulated API delays
- Session persistence
- Error simulation for testing

## 🔒 Security Note

**Important**: The mock authentication system is for development only. It uses simple password matching and should never be used in production. Always use proper authentication with hashed passwords and secure tokens in production environments.

## 🎉 Benefits

- **No Backend Required**: Test the frontend without setting up a backend
- **Multiple Roles**: Test all user roles and permissions
- **Realistic Experience**: Simulates real API behavior
- **Easy Switching**: Seamlessly switch between mock and real API
- **Development Speed**: Faster development and testing cycles
