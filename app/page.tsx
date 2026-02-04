// app/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getVehicles, Vehicle } from '@/lib/vehicleStore';

export default function HomePage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Load vehicles on component mount
  useEffect(() => {
    const loadedVehicles = getVehicles();
    setVehicles(loadedVehicles);
    setLoading(false);
  }, []);

  const handleAddVehicle = () => {
    router.push('/add-vehicle');
  };

  const handleViewDetails = (id: string) => {
    router.push(`/vehicles/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading your garage...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Garage</h1>
            <p className="text-gray-600 mt-1">
              {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} tracked
            </p>
          </div>
          
          <button
            onClick={handleAddVehicle}
            className="mt-4 sm:mt-0 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            + Add Vehicle
          </button>
        </div>

        {/* Empty State */}
        {vehicles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">🚗</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No vehicles yet
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first vehicle to start tracking maintenance and service history.
            </p>
            <button
              onClick={handleAddVehicle}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Your First Vehicle
            </button>
          </div>
        ) : (
          /* Vehicle Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewDetails(vehicle.id)}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      {vehicle.licensePlate && (
                        <p className="text-sm text-gray-500 mt-1">
                          {vehicle.licensePlate}
                        </p>
                      )}
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {vehicle.currentMileage.toLocaleString()} mi
                    </span>
                  </div>

                  {vehicle.notes && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                      {vehicle.notes}
                    </p>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Added: {new Date(vehicle.dateAdded).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Your data is saved locally in your browser</p>
        </div>
      </div>
    </div>
  );
}