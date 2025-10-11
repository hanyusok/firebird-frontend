'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import Loading from '@/components/Loading';
import Error from '@/components/Error';
import { ClinicApiService } from '@/lib/api';
import { UserActivity } from '@/types/auth';
import { 
  Activity, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Clock, 
  Monitor,
  Globe,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function ActivityPage() {
  const { hasPermission } = useAuth();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [expandedActivities, setExpandedActivities] = useState<Set<number>>(new Set());

  // Check if user has permission to view activity
  if (!hasPermission('canViewActivity')) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to view activity logs.</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const activitiesData = await ClinicApiService.getUserActivity();
      setActivities(activitiesData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (activityId: number) => {
    const newExpanded = new Set(expandedActivities);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedActivities(newExpanded);
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || activity.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
      case 'created':
        return '➕';
      case 'update':
      case 'updated':
        return '✏️';
      case 'delete':
      case 'deleted':
        return '🗑️';
      case 'login':
      case 'logged in':
        return '🔐';
      case 'logout':
      case 'logged out':
        return '🚪';
      case 'view':
      case 'viewed':
        return '👁️';
      case 'search':
      case 'searched':
        return '🔍';
      default:
        return '📝';
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
      case 'created':
        return 'bg-green-100 text-green-800';
      case 'update':
      case 'updated':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
      case 'deleted':
        return 'bg-red-100 text-red-800';
      case 'login':
      case 'logged in':
        return 'bg-purple-100 text-purple-800';
      case 'logout':
      case 'logged out':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Loading size="lg" text="Loading activity log..." />
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
                <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
                <p className="mt-2 text-sm text-gray-700">
                  Track user activities and system events
              </p>
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
                    Search Activities
                  </label>
                  <div className="mt-1 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search by action, resource, or details..."
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="action-filter" className="block text-sm font-medium text-gray-700">
                    Filter by Action
                  </label>
                  <div className="mt-1 relative">
                    <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <select
                      id="action-filter"
                      value={actionFilter}
                      onChange={(e) => setActionFilter(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="all">All Actions</option>
                      <option value="create">Create</option>
                      <option value="update">Update</option>
                      <option value="delete">Delete</option>
                      <option value="login">Login</option>
                      <option value="logout">Logout</option>
                      <option value="view">View</option>
                      <option value="search">Search</option>
                    </select>
                </div>
                </div>
              </div>
            </div>

            {/* Activities List */}
            <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Activities ({filteredActivities.length})
                </h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm || actionFilter !== 'all' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Activities will appear here as users interact with the system.'
                      }
                    </p>
                  </div>
                ) : (
                  filteredActivities.map((activity) => (
                    <div key={activity.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <span className="text-2xl">{getActionIcon(activity.action)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(activity.action)}`}>
                                {activity.action}
                              </span>
                              <span className="text-sm text-gray-600">{activity.resource}</span>
                              {activity.resourceId && (
                                <span className="text-sm text-gray-500">#{activity.resourceId}</span>
                              )}
                            </div>
                            
                            {activity.details && (
                              <p className="mt-1 text-sm text-gray-600">{activity.details}</p>
                            )}
                            
                            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                User ID: {activity.userId}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatTimestamp(activity.timestamp)}
                              </div>
                              <div className="flex items-center">
                                <Monitor className="h-3 w-3 mr-1" />
                                {activity.ipAddress}
                              </div>
                            </div>
                            
                            {activity.userAgent && (
                              <div className="mt-2">
                                <button
                                  onClick={() => toggleExpanded(activity.id)}
                                  className="flex items-center text-xs text-gray-500 hover:text-gray-700"
                                >
                                  {expandedActivities.has(activity.id) ? (
                                    <>
                                      <ChevronUp className="h-3 w-3 mr-1" />
                                      Hide Details
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="h-3 w-3 mr-1" />
                                      Show Details
                                    </>
                                  )}
                                </button>
                                
                                {expandedActivities.has(activity.id) && (
                                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                    <div className="text-xs text-gray-600">
                                      <div className="flex items-center mb-1">
                                        <Globe className="h-3 w-3 mr-1" />
                                        <span className="font-medium">User Agent:</span>
                                      </div>
                                      <p className="break-all">{activity.userAgent}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0 text-right">
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
                </div>
                </div>
                  ))
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}