// lib/vehicleStore.ts

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  currentMileage: number;
  dateAdded: string; // ISO string
}

const VEHICLE_STORAGE_KEY = 'vehicles';

// Get vehicles from localStorage (or return empty array)
export function getVehicles(): Vehicle[] {
  if (typeof window === 'undefined') return []; // SSR safety
  const stored = localStorage.getItem(VEHICLE_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Save vehicles to localStorage
export function saveVehicles(vehicles: Vehicle[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(VEHICLE_STORAGE_KEY, JSON.stringify(vehicles));
}

// Add a new vehicle
export function addVehicle(vehicle: Omit<Vehicle, 'id' | 'dateAdded'>): Vehicle {
  const vehicles = getVehicles();
  const newVehicle: Vehicle = {
    id: Date.now().toString(), // simple unique ID 
    ...vehicle,
    dateAdded: new Date().toISOString(),
  };
  saveVehicles([...vehicles, newVehicle]);
  return newVehicle;
}