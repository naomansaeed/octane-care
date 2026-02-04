// app/vehicles/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getVehicles, Vehicle } from '@/lib/vehicleStore';

export default function VehicleDetailPage() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Extract ID from URL pathname
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

  const handleEdit = () => {
    alert('Edit feature coming soon!');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to remove this vehicle?')) {
      alert('Delete feature coming soon!');
    }
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
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
              onClick={handleEdit}
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