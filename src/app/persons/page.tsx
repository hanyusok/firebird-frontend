'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Loading from '@/components/Loading';
import Error from '@/components/Error';
import PersonCard from '@/components/PersonCard';
import PersonModal from '@/components/PersonModal';
import { ClinicApiService, Person } from '@/lib/api';
import { Search } from 'lucide-react';

export default function PersonsPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [reserveDate] = useState<string>(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [searchType, setSearchType] = useState<'name' | 'birthdate'>('name');
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  // No initial fetch; search on demand

  const fetchPersons = async () => {
    try {
      setLoading(true);
      setError(null);
      if (searchType === 'name') {
        const results = await ClinicApiService.searchPersonsByName(searchTerm.trim());
        setPersons(results);
      } else {
        // Derive SEARCHID prefix from birthdate input (e.g., '1972. 10. 23.' -> '721023')
        const digits = searchTerm.replace(/\D/g, '');
        if (digits.length < 8) {
          setPersons([]);
        } else {
          const yyyy = digits.slice(0, 4);
          const yymmdd = yyyy.slice(2) + digits.slice(4, 6) + digits.slice(6, 8);
          const results = await ClinicApiService.searchPersonsBySearchId(`${yymmdd}-`);
          setPersons(results);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? (err as Error).message : 'Failed to fetch persons');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePerson = async (personData: Partial<Person>) => {
    try {
      const newPerson = await ClinicApiService.createPerson(personData);
      setPersons(prev => [...prev, newPerson]);
      setShowModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? (err as Error).message : 'Failed to create person');
    }
  };

  const handleUpdatePerson = async (id: number, personData: Partial<Person>) => {
    try {
      const updatedPerson = await ClinicApiService.updatePerson(id, personData);
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
      await ClinicApiService.deletePerson(id);
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

  const handleReserve = async (person: Person) => {
    try {
      setError(null);
      const yyyymmdd = reserveDate.replace(/-/g, '');
      await ClinicApiService.createReservationForDate(yyyymmdd, { PCODE: person.PCODE });
      alert('예약이 등록되었습니다.');
    } catch (err: unknown) {
      setError(err instanceof Error ? (err as Error).message : 'Failed to create reservation');
    }
  };

  const filteredPersons = persons.filter(person => {
    const q = searchTerm.toLowerCase();
    if (searchType === 'birthdate') {
      return person.PBIRTH.includes(searchTerm);
    }
    return (
      person.PNAME.toLowerCase().includes(q) ||
      person.SEARCHID.toLowerCase().includes(q)
    );
  });

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
            {/* Creation disabled per requirements */}
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
              <div className="flex-1 flex">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder={searchType === 'name' ? '이름 또는 SEARCHID로 검색' : '생년월일로 검색 (예: 1990. 1. 1.)'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <button
                  onClick={fetchPersons}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  검색
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="name"
                    checked={searchType === 'name'}
                    onChange={(e) => setSearchType(e.target.value as 'name' | 'birthdate')}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">이름</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="birthdate"
                    checked={searchType === 'birthdate'}
                    onChange={(e) => setSearchType(e.target.value as 'name' | 'birthdate')}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">생년월일</span>
                </label>
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
                {/* Creation disabled per requirements */}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPersons.map((person) => (
                  <PersonCard
                    key={person.PCODE}
                    person={person}
                    onReserve={handleReserve}
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
