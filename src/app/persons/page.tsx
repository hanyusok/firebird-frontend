'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Loading from '@/components/Loading';
import Error from '@/components/Error';
import PersonCard from '@/components/PersonCard';
import PersonModal from '@/components/PersonModal';
import { FirebirdApiService, Person } from '@/lib/api';
import { Plus, Search, Filter } from 'lucide-react';

export default function PersonsPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await FirebirdApiService.getPersons();
      setPersons(data.persons);
    } catch (err: unknown) {
      setError(err instanceof Error ? (err as Error).message : 'Failed to fetch persons');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePerson = async (personData: Partial<Person>) => {
    try {
      const newPerson = await FirebirdApiService.createPerson(personData);
      setPersons(prev => [...prev, newPerson]);
      setShowModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? (err as Error).message : 'Failed to create person');
    }
  };

  const handleUpdatePerson = async (id: number, personData: Partial<Person>) => {
    try {
      const updatedPerson = await FirebirdApiService.updatePerson(id, personData);
      setPersons(prev => prev.map(p => p.PCODE === id ? updatedPerson : p));
      setEditingPerson(null);
      setShowModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? (err as Error).message : 'Failed to update person');
    }
  };

  const handleDeletePerson = async (id: number) => {
    if (!confirm('Are you sure you want to delete this person?')) return;
    
    try {
      await FirebirdApiService.deletePerson(id);
      setPersons(prev => prev.filter(p => p.PCODE !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? (err as Error).message : 'Failed to delete person');
    }
  };

  const handleEditPerson = (person: Person) => {
    setEditingPerson(person);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPerson(null);
  };

  const filteredPersons = persons.filter(person =>
    person.PNAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.SEARCHID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.PBIRTH.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Loading size="lg" text="Loading persons..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Persons Management
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage person records in your Firebird database
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Person
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4">
              <Error message={error} onRetry={fetchPersons} />
            </div>
          )}

          {/* Search and Filter */}
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search persons by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {persons.length}
                      </span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Persons
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {persons.length}
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
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {filteredPersons.length}
                      </span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Filtered Results
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {filteredPersons.length}
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
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {persons.filter(p => p.VINFORM).length}
                      </span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        With VINFORM
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {persons.filter(p => p.VINFORM).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Persons Grid */}
          <div className="mt-6">
            {filteredPersons.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <Search className="h-12 w-12" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No persons found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new person.'}
                </p>
                {!searchTerm && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Person
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPersons.map((person) => (
                  <PersonCard
                    key={person.PCODE}
                    person={person}
                    onEdit={handleEditPerson}
                    onDelete={handleDeletePerson}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Person Modal */}
      {showModal && (
        <PersonModal
          person={editingPerson}
          onSave={editingPerson ? 
            (data) => handleUpdatePerson(editingPerson.PCODE, data) : 
            handleCreatePerson
          }
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
