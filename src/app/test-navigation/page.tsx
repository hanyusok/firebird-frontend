'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import { User, LogOut, CheckCircle, XCircle } from 'lucide-react';

export default function TestNavigationPage() {
  const { user, isAuthenticated, logout, hasPermission } = useAuth();

  const permissions = [
    'canViewPatients',
    'canEditPatients',
    'canDeletePatients',
    'canViewReservations',
    'canCreateReservations',
    'canEditReservations',
    'canDeleteReservations',
    'canViewActivity',
    'canManageUsers',
    'canViewSettings',
    'canEditSettings',
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Navigation Flow Test</h1>
              
              {/* Authentication Status */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Authentication Status</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {isAuthenticated ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="ml-2 text-sm font-medium">
                        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                      </span>
                    </div>
                  </div>
                  
                  {user && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">Name: {user.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600">Email: {user.email}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600">Role: {user.role}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600">Department: {user.department || 'N/A'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Permissions Test */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Permissions Test</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {permissions.map((permission) => (
                      <div key={permission} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{permission}</span>
                        <div className="flex items-center">
                          {hasPermission(permission as keyof typeof ROLE_PERMISSIONS.admin) ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Test */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Navigation Test</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Check if the navigation menu shows the correct items based on your role and permissions.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Dashboard: </span>
                      <span className="ml-2 text-sm font-medium text-green-600">Always visible</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Patients: </span>
                      {hasPermission('canViewPatients') ? (
                        <span className="ml-2 text-sm font-medium text-green-600">Visible</span>
                      ) : (
                        <span className="ml-2 text-sm font-medium text-red-600">Hidden</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Reservations: </span>
                      {hasPermission('canViewReservations') ? (
                        <span className="ml-2 text-sm font-medium text-green-600">Visible</span>
                      ) : (
                        <span className="ml-2 text-sm font-medium text-red-600">Hidden</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Activity: </span>
                      {hasPermission('canViewActivity') ? (
                        <span className="ml-2 text-sm font-medium text-green-600">Visible</span>
                      ) : (
                        <span className="ml-2 text-sm font-medium text-red-600">Hidden</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Settings: </span>
                      {hasPermission('canViewSettings') ? (
                        <span className="ml-2 text-sm font-medium text-green-600">Visible</span>
                      ) : (
                        <span className="ml-2 text-sm font-medium text-red-600">Hidden</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Menu Test */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">User Menu Test</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Check if the user menu in the top-right corner shows the correct options.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Profile Settings: </span>
                      <span className="ml-2 text-sm font-medium text-green-600">Always visible</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Manage Users: </span>
                      {hasPermission('canManageUsers') ? (
                        <span className="ml-2 text-sm font-medium text-green-600">Visible</span>
                      ) : (
                        <span className="ml-2 text-sm font-medium text-red-600">Hidden</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Sign Out: </span>
                      <span className="ml-2 text-sm font-medium text-green-600">Always visible</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <button
                  onClick={logout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
                
                <a
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
