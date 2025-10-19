'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import Loading from '@/components/Loading';
import Error from '@/components/Error';
import { ClinicApiService } from '@/lib/api';
import { UserType, UserRole } from '@/types/auth';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  User,
  Mail, 
  Phone, 
  Building, 
  Calendar,
  Filter,
  MoreVertical
} from 'lucide-react';

export default function UsersPage() {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [showUserMenu, setShowUserMenu] = useState<number | null>(null);

  // Check if user has permission to manage users
  if (!hasPermission('canManageUsers')) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to manage users.</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await ClinicApiService.getUsers();
      setUsers(usersData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: number) => {
    try {
      const updatedUser = await ClinicApiService.toggleUserStatus(userId);
      setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user));
      setShowUserMenu(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to toggle user status');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await ClinicApiService.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
      setShowUserMenu(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'nurse': return 'bg-green-100 text-green-800';
      case 'receptionist': return 'bg-yellow-100 text-yellow-800';
      case 'patient': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Loading size="lg" text="Loading users..." />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="mt-2 text-sm text-gray-700">
                  Manage user accounts and permissions for MartClinic Direct
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                    Search Users
                  </label>
                  <div className="mt-1 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search by name or email..."
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700">
                    Filter by Role
                  </label>
                  <div className="mt-1 relative">
                    <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <select
                      id="role-filter"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Administrator</option>
                      <option value="doctor">Doctor</option>
                      <option value="nurse">Nurse</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="patient">Patient</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {user.email}
                              </div>
                              {user.phone && (
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {user.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.department ? (
                            <div className="flex items-center">
                              <Building className="h-3 w-3 mr-1 text-gray-400" />
                              {user.department}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? (
                              <>
                                <UserCheck className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <UserX className="h-3 w-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLoginAt ? (
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(user.lastLoginAt).toLocaleDateString()}
                            </div>
                          ) : (
                            <span className="text-gray-400">Never</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative">
                            <button
                              onClick={() => setShowUserMenu(showUserMenu === user.id ? null : user.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            
                            {showUserMenu === user.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                <button
                                  onClick={() => {
                                    setEditingUser(user);
                                    setShowUserMenu(null);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit User
                                </button>
                                <button
                                  onClick={() => handleToggleUserStatus(user.id)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  {user.isActive ? (
                                    <>
                                      <UserX className="h-4 w-4 mr-2" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="h-4 w-4 mr-2" />
                                      Activate
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || roleFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Get started by creating a new user.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
