'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Loading from '@/components/Loading';
import Error from '@/components/Error';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ClinicApiService } from '@/lib/api';
import { Stethoscope, Users, Activity, CheckCircle } from 'lucide-react';

interface DashboardStats {
  totalPatients: number;
  apiStatus: string;
  lastUpdate: string;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch patients count
        const personsData = await ClinicApiService.getPersons();

        setStats({
          totalPatients: personsData.persons.length,
          apiStatus: 'Connected',
          lastUpdate: new Date().toLocaleString(),
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? (err as Error).message : 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Re-trigger the useEffect
    window.location.reload();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        {loading && (
          <Loading size="lg" text="Loading dashboard..." />
        )}

        {error && (
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Error message={error} onRetry={handleRetry} />
          </div>
        )}

        {!loading && !error && (
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <Stethoscope className="mx-auto h-12 w-12 text-blue-600" />
              <h1 className="mt-4 text-3xl font-bold text-gray-900">
                MartClinic Direct
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Easy outpatient reservation and clinic information access
              </p>
            </div>

            {/* Stats Grid */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Patients
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats?.totalPatients || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          API Status
                        </dt>
                        <dd className="text-lg font-medium text-green-600">
                          {stats?.apiStatus || 'Unknown'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Activity className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Last Update
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats?.lastUpdate ? new Date(stats.lastUpdate).toLocaleTimeString() : 'Never'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <a
                  href="/persons"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                      <Users className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Manage Patients
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      View, add, edit, and delete patient records from your clinic database.
                    </p>
                  </div>
                </a>

                <a
                  href="/activity"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                      <Activity className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      View Activity
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Monitor clinic activity and recent patient interactions.
                    </p>
                  </div>
                </a>

                <a
                  href="/settings"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                      <Stethoscope className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Clinic Settings
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Configure clinic settings and system preferences.
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
          </div>
        </main>
        )}
      </div>
    </ProtectedRoute>
  );
}
