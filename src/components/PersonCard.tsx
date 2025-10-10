'use client';

import { Person } from '@/lib/api';
import { Calendar, CalendarPlus } from 'lucide-react';

interface PersonCardProps {
  person: Person;
}

export default function PersonCard({ person, onReserve }: PersonCardProps & { onReserve?: (person: Person) => void }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {person.PNAME}
            </h3>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
              <span className="truncate">생년월일: {person.PBIRTH}</span>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                성별: {person.SEX === '1' ? '남성' : person.SEX === '2' ? '여성' : person.SEX === '3' ? '남아' : '여아'}
              </span>
            </div>
            {person.RELATION2 && (
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  관계: {person.RELATION2}
                </span>
              </div>
            )}
            {person.SEARCHID && (
              <div className="mt-1 flex items-center text-xs text-gray-400">
                <span>검색ID: {person.SEARCHID}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 sm:px-6">
                <div className="flex justify-end space-x-2">
                  {onReserve && (
                    <button
                      onClick={() => onReserve(person)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                    >
                      <CalendarPlus className="h-3 w-3 mr-1" />
                      Reserve
                    </button>
                  )}
        </div>
      </div>
    </div>
  );
}
