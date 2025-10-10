'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Loading from '@/components/Loading';
import Error from '@/components/Error';
import { FirebirdApiService, Reservation } from '@/lib/api';
import { Search, Calendar, User, Phone, Clock, MapPin, CheckCircle } from 'lucide-react';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'birthdate'>('name');
  const [searchResults, setSearchResults] = useState<Reservation[]>([]);
  const [queueStats, setQueueStats] = useState<{
    total: number;
    waiting: number;
    completed: number;
    byService: Record<string, number>;
  } | null>(null);

  // Load queue statistics
  useEffect(() => {
    const loadQueueStats = async () => {
      try {
        const reservations = await FirebirdApiService.getReservations();
        
        const stats = {
          total: reservations.length,
          waiting: reservations.filter(r => !r.RESERVED).length,
          completed: reservations.filter(r => r.RESERVED).length,
          byService: reservations.reduce((acc, r) => {
            acc[r.GUBUN] = (acc[r.GUBUN] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        };
        
        setQueueStats(stats);
      } catch (err) {
        console.error('Error loading queue stats:', err);
      }
    };

    loadQueueStats();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let results: Reservation[];
      if (searchType === 'name') {
        results = await FirebirdApiService.searchReservationsByName(searchTerm);
      } else {
        results = await FirebirdApiService.searchReservationsByBirthDate(searchTerm);
      }
      
      setSearchResults(results);
    } catch (err: unknown) {
      setError(err instanceof Error ? (err as Error).message : '검색 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const getServiceTypeColor = (gubun: string) => {
    switch (gubun) {
      case '요양': return 'bg-blue-100 text-blue-800';
      case '검사': return 'bg-green-100 text-green-800';
      case '의보': return 'bg-purple-100 text-purple-800';
      case '접종': return 'bg-yellow-100 text-yellow-800';
      case '1 종': return 'bg-red-100 text-red-800';
      case 'Doc': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGenderText = (sex: string) => {
    switch (sex) {
      case '1': return '남성';
      case '2': return '여성';
      case '3': return '남아';
      case '4': return '여아';
      default: return '알 수 없음';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Loading size="lg" text="검색 중..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              실시간 예약 조회
            </h1>
            <p className="text-lg text-gray-600">
              이름 또는 생년월일로 예약을 검색하세요
            </p>
          </div>

          {/* Queue Statistics */}
          {queueStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          총 예약자
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {queueStats.total}명
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
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          대기중
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {queueStats.waiting}명
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
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          완료
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {queueStats.completed}명
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
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          서비스 유형
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {Object.keys(queueStats.byService).length}종류
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Service Type Breakdown */}
          {queueStats && Object.keys(queueStats.byService).length > 0 && (
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">서비스별 현황</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Object.entries(queueStats.byService).map(([service, count]) => (
                  <div key={service} className="text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getServiceTypeColor(service)}`}>
                      {service}
                    </div>
                    <div className="mt-2 text-2xl font-bold text-gray-900">
                      {count}
                    </div>
                    <div className="text-sm text-gray-500">명</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Form */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Type Selection */}
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="name"
                    checked={searchType === 'name'}
                    onChange={(e) => setSearchType(e.target.value as 'name' | 'birthdate')}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">이름으로 검색</span>
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
                  <span className="text-sm font-medium text-gray-700">생년월일로 검색</span>
                </label>
              </div>

              {/* Search Input */}
              <div className="flex-1 flex">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={searchType === 'name' ? '이름을 입력하세요' : '생년월일을 입력하세요 (예: 1990. 1. 1.)'}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  검색
                </button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6">
              <Error message={error} onRetry={() => setError(null)} />
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  검색 결과 ({searchResults.length}건)
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {searchResults.map((reservation) => (
                  <div key={`${reservation.PCODE}-${reservation.VISIDATE}`} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h4 className="text-lg font-medium text-gray-900">
                            {reservation.PNAME}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getServiceTypeColor(reservation.GUBUN)}`}>
                            {reservation.GUBUN}
                          </span>
                          <span className="text-sm text-gray-500">
                            {getGenderText(reservation.SEX)} • {reservation.AGE}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span>예약일: {reservation.VISIDATE}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            <span>예약시간: {reservation.VISITIME === '1970. 1. 1.' ? '미정' : reservation.VISITIME}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            <span>생년월일: {reservation.PBIRTH}</span>
                          </div>
                          {reservation.PHONENUM && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              <span>연락처: {reservation.PHONENUM}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            #{reservation.N}
                          </div>
                          <div className="text-sm text-gray-500">대기번호</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600 font-medium">
                            {reservation.RESERVED ? '예약완료' : '대기중'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {searchTerm && searchResults.length === 0 && !loading && (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">검색 결과가 없습니다</h3>
              <p className="mt-1 text-sm text-gray-500">
                다른 검색어로 다시 시도해보세요.
              </p>
            </div>
          )}

          {/* Instructions */}
          {!searchTerm && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <Search className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                예약 검색을 시작하세요
              </h3>
              <p className="text-gray-500 mb-4">
                이름 또는 생년월일을 입력하여 예약 정보를 조회할 수 있습니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">이름으로 검색</h4>
                  <p className="text-sm text-blue-700">
                    환자의 이름을 입력하여 예약 정보를 찾을 수 있습니다.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">생년월일로 검색</h4>
                  <p className="text-sm text-green-700">
                    생년월일을 입력하여 예약 정보를 찾을 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
