import { createClient } from '@supabase/supabase-js';
import { Location, AttendanceRecord, Profile } from '@/types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data as Profile;
};

export const getLocations = async () => {
  const { data, error } = await supabase.from('locations').select('*').eq('active', true).order('name');
  if (error) throw error;
  return data as Location[];
};

export const checkIn = async (userId: string, locationId: string, latitude: number, longitude: number, distanceMeters: number) => {
  const { data, error } = await supabase
    .from('attendance_records')
    .insert({ user_id: userId, location_id: locationId, check_in: new Date().toISOString(), latitude, longitude, distance_meters: distanceMeters })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const checkOut = async (recordId: string, latitude?: number, longitude?: number) => {
  const updateData: any = { check_out: new Date().toISOString() };
  if (latitude && longitude) {
    updateData.latitude = latitude;
    updateData.longitude = longitude;
  }
  const { data, error } = await supabase.from('attendance_records').update(updateData).eq('id', recordId).select().single();
  if (error) throw error;
  return data;
};

export const getActiveSession = async (userId: string) => {
  const { data, error } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('user_id', userId)
    .is('check_out', null)
    .order('check_in', { ascending: false })
    .limit(1);
  if (error) throw error;
  return data.length > 0 ? data[0] : null;
};
