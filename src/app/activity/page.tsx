'use client';

import Navigation from '@/components/Navigation';
import { Activity, Clock, Database, Users } from 'lucide-react';

export default function ActivityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Activity Log
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Monitor database activity and recent changes
              </p>
            </div>
          </div>

          {/* Placeholder Content */}
          <div className="mt-8 bg-white shadow rounded-lg p-8">
            <div className="text-center">
              <Activity className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Activity Log</h3>
              <p className="mt-1 text-sm text-gray-500">
                This feature will show recent database activity and changes.
              </p>
            </div>

            {/* Sample Activity Items */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New person added: John Doe
                  </p>
                  <p className="text-sm text-gray-500">
                    2 minutes ago
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Database className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Database connection established
                  </p>
                  <p className="text-sm text-gray-500">
                    5 minutes ago
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Person updated: Jane Smith
                  </p>
                  <p className="text-sm text-gray-500">
                    1 hour ago
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
