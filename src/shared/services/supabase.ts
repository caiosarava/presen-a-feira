import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
}

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

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
};

// Locations
export const getLocations = async () => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createLocation = async (location: any) => {
  const { data, error } = await supabase
    .from('locations')
    .insert(location)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateLocation = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('locations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteLocation = async (id: string) => {
  const { error } = await supabase.from('locations').delete().eq('id', id);
  if (error) throw error;
  return true;
};

// Users
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const updateUser = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Attendance
export const getAttendanceRecords = async (filters?: any) => {
  let query = supabase
    .from('attendance_records')
    .select(`
      *,
      profiles (name, email),
      locations (name)
    `)
    .order('check_in', { ascending: false });

  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }

  if (filters?.startDate) {
    query = query.gte('check_in', filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte('check_in', filters.endDate);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const updateAttendanceRecord = async (id: string, updates: any) => {
const { data, error } = await supabase
.from('attendance_records')
.update(updates)
.eq('id', id)
.select()
.single();
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
.limit(1)
.single();
if (error) return null;
return data;
};

export const checkIn = async (userId: string, locationId: string, latitude: number, longitude: number, distance: number) => {
const { data, error } = await supabase
.from('attendance_records')
.insert({ user_id: userId, location_id: locationId, latitude, longitude, distance })
.select()
.single();
if (error) throw error;
return data;
};

export const checkOut = async (recordId: string, latitude: number, longitude: number) => {
const { data, error } = await supabase
.from('attendance_records')
.update({ check_out: new Date().toISOString(), latitude, longitude })
.eq('id', recordId)
.select()
.single();
if (error) throw error;
return data;
};
