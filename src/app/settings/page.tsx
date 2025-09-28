'use client';

import Navigation from '@/components/Navigation';
import { Settings, Database, Server, Key, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Settings
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Configure database connections and application preferences
              </p>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="mt-8 space-y-6">
            {/* Database Configuration */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-blue-600" />
                  Database Configuration
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Configure your Firebird database connection settings.</p>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Host
                    </label>
                    <input
                      type="text"
                      defaultValue="localhost"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Port
                    </label>
                    <input
                      type="text"
                      defaultValue="3050"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* API Configuration */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <Server className="h-5 w-5 mr-2 text-green-600" />
                  API Configuration
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Configure API server settings and endpoints.</p>
                </div>
                <div className="mt-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      API Base URL
                    </label>
                    <input
                      type="text"
                      defaultValue="http://localhost:3000"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <Key className="h-5 w-5 mr-2 text-red-600" />
                  Security Settings
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Manage authentication and security preferences.</p>
                </div>
                <div className="mt-5 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="cors-enabled"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled
                    />
                    <label htmlFor="cors-enabled" className="ml-2 block text-sm text-gray-900">
                      Enable CORS
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="ssl-enabled"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled
                    />
                    <label htmlFor="ssl-enabled" className="ml-2 block text-sm text-gray-900">
                      Enable SSL/TLS
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Settings */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-purple-600" />
                  Network Settings
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Configure network and tunneling settings.</p>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ngrok Domain
                    </label>
                    <input
                      type="text"
                      defaultValue="prompt-liberal-vulture.ngrok-free.app"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tunnel Status
                    </label>
                    <div className="mt-1 flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-sm text-green-600">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
