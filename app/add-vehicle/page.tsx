// app/add-vehicle/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addVehicle } from '@/lib/vehicleStore';

export default function AddVehiclePage() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    currentMileage: '',
    licensePlate: '',
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.make.trim()) {
      newErrors.make = 'Make is required';
    }
    
    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }
    
    if (!formData.year.trim()) {
      newErrors.year = 'Year is required';
    } else if (isNaN(Number(formData.year))) {
      newErrors.year = 'Year must be a number';
    } else if (Number(formData.year) < 1900 || Number(formData.year) > 2030) {
      newErrors.year = 'Enter a valid year (1900-2030)';
    }
    
    if (!formData.currentMileage.trim()) {
      newErrors.currentMileage = 'Mileage is required';
    } else if (isNaN(Number(formData.currentMileage))) {
      newErrors.currentMileage = 'Mileage must be a number';
    } else if (Number(formData.currentMileage) < 0) {
      newErrors.currentMileage = 'Mileage cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Convert string inputs to proper types
      const vehicleData = {
        make: formData.make.trim(),
        model: formData.model.trim(),
        year: Number(formData.year),
        currentMileage: Number(formData.currentMileage),
        licensePlate: formData.licensePlate.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      };
      
      // Save to localStorage
      addVehicle(vehicleData);
      
      // Show success message
      alert('Vehicle added successfully!');
      
      // Navigate back to home
      router.push('/');
      
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Failed to add vehicle. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Vehicle
          </h1>
          <p className="text-gray-600">
            Enter your vehicle details to start tracking maintenance
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Make */}
            <div>
              <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
                Make <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="make"
                name="make"
                value={formData.make}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 ${
                  errors.make ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Toyota, Honda, Ford, etc."
                disabled={isSubmitting}
              />
              {errors.make && (
                <p className="mt-1 text-sm text-red-600">{errors.make}</p>
              )}
            </div>

            {/* Model */}
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                Model <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 ${
                  errors.model ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Camry, Civic, F-150, etc."
                disabled={isSubmitting}
              />
              {errors.model && (
                <p className="mt-1 text-sm text-red-600">{errors.model}</p>
              )}
            </div>

            {/* Year */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 ${
                  errors.year ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="2020"
                maxLength={4}
                disabled={isSubmitting}
              />
              {errors.year && (
                <p className="mt-1 text-sm text-red-600">{errors.year}</p>
              )}
            </div>

            {/* Current Mileage */}
            <div>
              <label htmlFor="currentMileage" className="block text-sm font-medium text-gray-700 mb-1">
                Current Mileage <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="currentMileage"
                name="currentMileage"
                value={formData.currentMileage}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 ${
                  errors.currentMileage ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="45,000"
                disabled={isSubmitting}
              />
              {errors.currentMileage && (
                <p className="mt-1 text-sm text-red-600">{errors.currentMileage}</p>
              )}
            </div>

            {/* License Plate (Optional) */}
            <div>
              <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">
                License Plate <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                id="licensePlate"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                placeholder="ABC-123"
                disabled={isSubmitting}
              />
            </div>

            {/* Notes (Optional) */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900"
                placeholder="Any additional notes about this vehicle..."
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className={`px-6 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </div>

        {/* Helper Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Fields marked with <span className="text-red-500">*</span> are required</p>
        </div>
      </div>
    </div>
  );
}