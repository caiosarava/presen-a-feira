import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getProfile } from '../../shared/services/supabase';
import { Profile } from '../../shared/types';

export function useAuth() {
const [user, setUser] = useState<User | null>(null);
const [profile, setProfile] = useState<Profile | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
setUser(session?.user ?? null);
if (session?.user) {
getProfile(session.user.id).then(setProfile).catch(console.error);
} else {
setProfile(null);
}
setLoading(false);
});
return () => subscription?.unsubscribe();
}, []);

return { user, profile, loading };
}
