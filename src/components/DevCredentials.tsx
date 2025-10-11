'use client';

import { useState } from 'react';
import { SAMPLE_CREDENTIALS } from '@/lib/config';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';

export default function DevCredentials() {
  const [showPasswords, setShowPasswords] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">🧪 Dev Credentials</h3>
        <button
          onClick={() => setShowPasswords(!showPasswords)}
          className="text-gray-400 hover:text-gray-600"
        >
          {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        {Object.entries(SAMPLE_CREDENTIALS).map(([role, creds]) => (
          <div key={role} className="border border-gray-100 rounded p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium capitalize text-gray-700">{role}</span>
              <span className="text-gray-500 text-xs">{creds.name}</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email:</span>
                <div className="flex items-center space-x-1">
                  <code className="text-gray-800 bg-gray-100 px-1 rounded text-xs">
                    {creds.email}
                  </code>
                  <button
                    onClick={() => copyToClipboard(creds.email, `${role}-email`)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {copiedField === `${role}-email` ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Password:</span>
                <div className="flex items-center space-x-1">
                  <code className="text-gray-800 bg-gray-100 px-1 rounded text-xs">
                    {showPasswords ? creds.password : '••••••••'}
                  </code>
                  <button
                    onClick={() => copyToClipboard(creds.password, `${role}-password`)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {copiedField === `${role}-password` ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          💡 Click the copy icons to copy credentials to clipboard
        </p>
      </div>
    </div>
  );
}
