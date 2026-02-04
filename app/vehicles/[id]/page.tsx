// app/vehicles/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getVehicles, updateVehicle, hardDeleteVehicle, Vehicle } from '@/lib/vehicleStore';

export default function VehicleDetailPage() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    currentMileage: '',
    licensePlate: '',
    notes: '',
  });

  useEffect(() => {
    const pathname = window.location.pathname;
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];

    if (!id) {
      setError('Invalid vehicle ID');
      setLoading(false);
      return;
    }

    try {
      const vehicles = getVehicles();
      const found = vehicles.find(v => v.id === id);

      if (!found) {
        setError('Vehicle not found');
        setLoading(false);
        return;
      }

      setVehicle(found);
      
      // Initialize form data for editing
      setFormData({
        make: found.make,
        model: found.model,
        year: found.year.toString(),
        currentMileage: found.currentMileage.toString(),
        licensePlate: found.licensePlate || '',
        notes: found.notes || '',
      });
    } catch (err) {
      setError('Error loading vehicle details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleBack = () => {
    router.back();
  };

  const handleDelete = () => {
    if (!vehicle) return;

    if (window.confirm(`Are you sure you want to remove this vehicle?\n\n${vehicle.year} ${vehicle.make} ${vehicle.model}`)) {
      const success = hardDeleteVehicle(vehicle.id);
      
      if (success) {
        alert('Vehicle removed successfully!');
        router.push('/');
      } else {
        alert('Failed to remove vehicle. Please try again.');
      }
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    if (!vehicle) return;

    // Basic validation
    if (!formData.make.trim()) {
      alert('Make is required');
      return;
    }
    if (!formData.model.trim()) {
      alert('Model is required');
      return;
    }
    if (!formData.year.trim() || isNaN(Number(formData.year))) {
      alert('Valid year is required');
      return;
    }
    if (!formData.currentMileage.trim() || isNaN(Number(formData.currentMileage))) {
      alert('Valid mileage is required');
      return;
    }

    try {
      const updated = updateVehicle(vehicle.id, {
        make: formData.make.trim(),
        model: formData.model.trim(),
        year: Number(formData.year),
        currentMileage: Number(formData.currentMileage),
        licensePlate: formData.licensePlate.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      });

      if (updated) {
        setVehicle(updated);
        alert('Vehicle updated successfully!');
        setIsEditing(false);
      } else {
        alert('Failed to update vehicle');
      }
    } catch (err) {
      console.error('Error updating vehicle:', err);
      alert('An error occurred while updating');
    }
  };

  const handleCancelEdit = () => {
    if (vehicle) {
      // Reset form to current vehicle data
      setFormData({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year.toString(),
        currentMileage: vehicle.currentMileage.toString(),
        licensePlate: vehicle.licensePlate || '',
        notes: vehicle.notes || '',
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-lg">Loading vehicle details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return null;
  }

  // Render Edit Form
  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Vehicle</h1>
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              × Close
            </button>
          </div>

          {/* Edit Form Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form className="space-y-6">
              
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
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Toyota, Honda, Ford, etc."
                />
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
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Camry, Civic, F-150, etc."
                />
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
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="2020"
                  maxLength={4}
                />
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
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="45,000"
                />
              </div>

              {/* License Plate */}
              <div>
                <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">
                  License Plate <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  id="licensePlate"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="ABC-123"
                />
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  placeholder="Any additional notes about this vehicle..."
                  rows={3}
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Render View Mode
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            {vehicle.licensePlate && (
              <p className="text-gray-600 mt-1 text-lg">{vehicle.licensePlate}</p>
            )}
          </div>
          
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button
              onClick={handleEditToggle}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Remove
            </button>
          </div>
        </div>

        {/* Vehicle Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Current Mileage</h3>
              <p className="text-xl font-semibold text-gray-900 mt-1">
                {vehicle.currentMileage.toLocaleString()} mi
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date Added</h3>
              <p className="text-gray-900 mt-1">
                {new Date(vehicle.dateAdded).toLocaleDateString()}
              </p>
            </div>
            
            {vehicle.lastUpdated && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="text-gray-900 mt-1">
                  {new Date(vehicle.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            )}
            
            {vehicle.notes && (
              <div className="sm:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="text-gray-900 mt-1">{vehicle.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Maintenance Section (Placeholder) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Maintenance History</h2>
            <button 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => alert('Maintenance logging coming soon!')}
            >
              + Add Service
            </button>
          </div>
          
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔧</div>
            <p className="text-gray-500 font-medium">No maintenance records yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Track oil changes, tire rotations, and more
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span>←</span>
            <span>Back to Garage</span>
          </button>
        </div>
      </div>
    </div>
  );
}