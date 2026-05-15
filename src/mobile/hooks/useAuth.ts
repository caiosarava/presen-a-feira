import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getProfile } from '@/services/supabase';
import { Profile } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChanged((_user) => {
      setUser(_user);
      if (_user) {
        getProfile(_user.id).then(setProfile).catch(console.error);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => subscription?.unsubscribe();
  }, []);

  return { user, profile, loading };
}
