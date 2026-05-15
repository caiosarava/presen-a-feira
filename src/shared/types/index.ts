export interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  address?: string;
  active: boolean;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  user_id: string;
  location_id: string;
  check_in: string;
  check_out?: string;
  latitude?: number;
  longitude?: number;
  distance_meters?: number;
  created_at: string;
  profiles?: {
    name: string;
    email: string;
  };
  locations?: {
    name: string;
  };
}
