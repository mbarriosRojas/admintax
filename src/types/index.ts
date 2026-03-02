export interface City {
  _id: string;
  name: string;
  country: string;
  timezone: string;
  active: boolean;
  createdAt: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator';
  cityId: string;
  city?: City;
  active: boolean;
  createdAt: string;
}

export interface Vehicle {
  _id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  cityId: string;
  city?: City;
  status: 'active' | 'maintenance' | 'inactive';
  createdAt: string;
}

export interface Driver {
  _id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  email?: string;
  cityId: string;
  city?: City;
  vehicleId?: string;
  vehicle?: Vehicle;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Route {
  _id: string;
  name: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedTime: number;
  cityId: string;
  city?: City;
  active: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalVehicles: number;
  activeDrivers: number;
  totalRoutes: number;
  maintenanceVehicles: number;
  activeUsers: number;
  vehiclesByCity: Array<{ city: string; count: number }>;
  driversByCity: Array<{ city: string; count: number }>;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
