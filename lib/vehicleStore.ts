// lib/vehicleStore.ts

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  currentMileage: number;
  
  // Optional but useful
  licensePlate?: string;
  
  // Timestamps (great for edit/delete tracking)
  dateAdded: string;      // ISO string
  lastUpdated?: string;   // ISO string (for edits)
  
  // Soft delete flag (instead of removing, mark as inactive)
  isDeleted?: boolean;
  
  // Metadata for future features
  notes?: string;
}

const VEHICLE_STORAGE_KEY = 'vehicles';

// Get all vehicles (optionally filter out deleted ones)
export function getVehicles(includeDeleted = false): Vehicle[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(VEHICLE_STORAGE_KEY);
  const vehicles: Vehicle[] = stored ? JSON.parse(stored) : [];
  //const vehicles = stored ? JSON.parse(stored) : [];
  
  return includeDeleted 
    ? vehicles 
    : vehicles.filter(v => !v.isDeleted);
}

// Save vehicles to localStorage
export function saveVehicles(vehicles: Vehicle[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(VEHICLE_STORAGE_KEY, JSON.stringify(vehicles));
}

// Add a new vehicle
export function addVehicle(data: Omit<Vehicle, 'id' | 'dateAdded' | 'lastUpdated' | 'isDeleted'>): Vehicle {
  const vehicles = getVehicles(true); // Get all, including deleted
  const newVehicle: Vehicle = {
    id: Date.now().toString(),
    ...data,
    dateAdded: new Date().toISOString(),
  };
  saveVehicles([...vehicles, newVehicle]);
  return newVehicle;
}

// Update an existing vehicle
export function updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | null {
  const vehicles = getVehicles(true);
  const index = vehicles.findIndex(v => v.id === id);
  
  if (index === -1) return null;
  
  const updatedVehicle = {
    ...vehicles[index],
    ...updates,
    lastUpdated: new Date().toISOString(),
  };
  
  vehicles[index] = updatedVehicle;
  saveVehicles(vehicles);
  return updatedVehicle;
}

// Soft delete (mark as deleted, don't remove)
export function deleteVehicle(id: string): boolean {
  return updateVehicle(id, { isDeleted: true }) !== null;
}

// Hard delete (remove completely) - use cautiously
export function hardDeleteVehicle(id: string): boolean {
  const vehicles = getVehicles(true);
  const filtered = vehicles.filter(v => v.id !== id);
  
  if (filtered.length === vehicles.length) return false; // Not found
  
  saveVehicles(filtered);
  return true;
}