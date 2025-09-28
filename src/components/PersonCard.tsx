'use client';

import { Person } from '@/lib/api';
import { formatDate, formatPhoneNumber } from '@/lib/utils';
import { Edit, Trash2, Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface PersonCardProps {
  person: Person;
  onEdit: (person: Person) => void;
  onDelete: (id: number) => void;
}

export default function PersonCard({ person, onEdit, onDelete }: PersonCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {person.name}
            </h3>
            {person.email && (
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <Mail className="flex-shrink-0 mr-1.5 h-4 w-4" />
                <span className="truncate">{person.email}</span>
              </div>
            )}
            {person.phone && (
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <Phone className="flex-shrink-0 mr-1.5 h-4 w-4" />
                <span>{formatPhoneNumber(person.phone)}</span>
              </div>
            )}
            {person.address && (
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4" />
                <span className="truncate">{person.address}</span>
              </div>
            )}
            {person.created_at && (
              <div className="mt-1 flex items-center text-xs text-gray-400">
                <Calendar className="flex-shrink-0 mr-1.5 h-3 w-3" />
                <span>Created {formatDate(person.created_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 sm:px-6">
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(person)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </button>
          <button
            onClick={() => onDelete(person.id!)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
