export interface Profile {
id: string;
name: string;
email: string;
role: 'admin' | 'user';
created_at: string;
}

export interface Location {
id: string;
name: string;
address: string;
latitude: number;
longitude: number;
radius_meters: number;
active: boolean;
created_at: string;
}

export interface AttendanceRecord {
id: string;
user_id: string;
location_id: string;
check_in: string;
check_out: string | null;
latitude?: number;
longitude?: number;
created_at: string;
}
