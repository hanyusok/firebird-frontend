'use client';

import { useState, useEffect } from 'react';
import { Person } from '@/lib/api';
import { X, Save, User, Calendar } from 'lucide-react';

interface PersonModalProps {
  person?: Person | null;
  onSave: (data: Partial<Person>) => void;
  onClose: () => void;
}

interface FormData {
  PNAME: string;
  PBIRTH: string;
  SEX: string;
  RELATION: string;
  RELATION2: string;
  SEARCHID: string;
}

interface FormErrors {
  PNAME?: string;
  PBIRTH?: string;
  SEX?: string;
  RELATION?: string;
  SEARCHID?: string;
}

export default function PersonModal({ person, onSave, onClose }: PersonModalProps) {
  const [formData, setFormData] = useState<FormData>({
    PNAME: '',
    PBIRTH: '',
    SEX: '1',
    RELATION: '1',
    RELATION2: '',
    SEARCHID: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = !!person;

  useEffect(() => {
    if (person) {
      setFormData({
        PNAME: person.PNAME || '',
        PBIRTH: person.PBIRTH || '',
        SEX: person.SEX || '1',
        RELATION: person.RELATION || '1',
        RELATION2: person.RELATION2 || '',
        SEARCHID: person.SEARCHID || '',
      });
    }
  }, [person]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.PNAME.trim()) {
      newErrors.PNAME = '이름은 필수입니다';
    }

    if (!formData.PBIRTH.trim()) {
      newErrors.PBIRTH = '생년월일은 필수입니다';
    }

    if (!formData.SEX) {
      newErrors.SEX = '성별을 선택해주세요';
    }

    if (!formData.RELATION) {
      newErrors.RELATION = '관계를 선택해주세요';
    }

    if (!formData.SEARCHID.trim()) {
      newErrors.SEARCHID = '검색ID는 필수입니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving person:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {isEdit ? '인물 정보 수정' : '새 인물 추가'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Form fields */}
            <div className="bg-white px-4 pb-4 sm:p-6">
              <div className="space-y-4">
                {/* Name field */}
                <div>
                  <label htmlFor="PNAME" className="block text-sm font-medium text-gray-700">
                    이름 *
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="PNAME"
                      value={formData.PNAME}
                      onChange={handleChange('PNAME')}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.PNAME ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                  {errors.PNAME && (
                    <p className="mt-1 text-sm text-red-600">{errors.PNAME}</p>
                  )}
                </div>

                {/* Birth date field */}
                <div>
                  <label htmlFor="PBIRTH" className="block text-sm font-medium text-gray-700">
                    생년월일 *
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="PBIRTH"
                      value={formData.PBIRTH}
                      onChange={handleChange('PBIRTH')}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.PBIRTH ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="예: 1990. 1. 1."
                    />
                  </div>
                  {errors.PBIRTH && (
                    <p className="mt-1 text-sm text-red-600">{errors.PBIRTH}</p>
                  )}
                </div>

                {/* Gender field */}
                <div>
                  <label htmlFor="SEX" className="block text-sm font-medium text-gray-700">
                    성별 *
                  </label>
                  <div className="mt-1">
                    <select
                      id="SEX"
                      value={formData.SEX}
                      onChange={handleChange('SEX')}
                      className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.SEX ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="1">남성</option>
                      <option value="2">여성</option>
                      <option value="3">남아</option>
                      <option value="4">여아</option>
                    </select>
                  </div>
                  {errors.SEX && (
                    <p className="mt-1 text-sm text-red-600">{errors.SEX}</p>
                  )}
                </div>

                {/* Relation field */}
                <div>
                  <label htmlFor="RELATION" className="block text-sm font-medium text-gray-700">
                    관계 *
                  </label>
                  <div className="mt-1">
                    <select
                      id="RELATION"
                      value={formData.RELATION}
                      onChange={handleChange('RELATION')}
                      className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.RELATION ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="1">본인</option>
                      <option value="2">배우자</option>
                      <option value="3">세대주</option>
                      <option value="4">가족</option>
                    </select>
                  </div>
                  {errors.RELATION && (
                    <p className="mt-1 text-sm text-red-600">{errors.RELATION}</p>
                  )}
                </div>

                {/* Relation2 field */}
                <div>
                  <label htmlFor="RELATION2" className="block text-sm font-medium text-gray-700">
                    관계 상세
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="RELATION2"
                      value={formData.RELATION2}
                      onChange={handleChange('RELATION2')}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="관계 상세를 입력하세요"
                    />
                  </div>
                </div>

                {/* Search ID field */}
                <div>
                  <label htmlFor="SEARCHID" className="block text-sm font-medium text-gray-700">
                    검색ID *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="SEARCHID"
                      value={formData.SEARCHID}
                      onChange={handleChange('SEARCHID')}
                      className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.SEARCHID ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="예: 900101-1"
                    />
                  </div>
                  {errors.SEARCHID && (
                    <p className="mt-1 text-sm text-red-600">{errors.SEARCHID}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    {isEdit ? 'Update Person' : 'Create Person'}
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
