import { useState, useEffect } from 'react';
import { supabase, signOut, getProfile } from '../../../shared/services/supabase';

export default function ProfileScreen() {
const [profile, setProfile] = useState<any>(null);
const [loading, setLoading] = useState(true);

useEffect(() => { loadProfile(); }, []);

const loadProfile = async () => {
try {
const { data: { user } } = await supabase.auth.getUser();
if (!user) return;
const profileData = await getProfile(user.id);
setProfile(profileData);
} catch (error) { console.error('Error:', error); }
finally { setLoading(false); }
};

const handleLogout = async () => {
if (confirm('Tem certeza que deseja sair?')) {
try {
await signOut();
} catch {
alert('Erro ao sair');
}
}
};

if (loading) return (
<div style={styles.centerContainer}>
<div className="spinner"></div>
</div>
);

return (
<div style={styles.container}>
<div style={styles.header}>
<h1 style={styles.title}>Perfil</h1>
</div>
<div style={styles.content}>
<div style={styles.avatarContainer}>
<div style={styles.avatar}>
<span style={styles.avatarText}>{profile?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
</div>
</div>
<div style={styles.infoCard}>
<div style={styles.infoRow}>
<span style={styles.infoLabel}>Nome:</span>
<span style={styles.infoValue}>{profile?.name || 'Nao informado'}</span>
</div>
<div style={styles.divider} />
<div style={styles.infoRow}>
<span style={styles.infoLabel}>E-mail:</span>
<span style={styles.infoValue}>{profile?.email || 'Nao informado'}</span>
</div>
<div style={styles.divider} />
<div style={styles.infoRow}>
<span style={styles.infoLabel}>Tipo:</span>
<span style={{ ...styles.infoValue, ...(profile?.role === 'admin' && styles.adminText) }}>
{profile?.role === 'admin' ? 'Administrador' : 'Usuario'}
</span>
</div>
</div>
<button style={styles.logoutButton} onClick={handleLogout}>
Sair
</button>
</div>
</div>
);
}

const styles: Record<string, React.CSSProperties> = {
container: { flex: 1, backgroundColor: '#F3F4F6', minHeight: '100vh' },
centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6', minHeight: '100vh' },
header: { padding: 24, paddingTop: 24, backgroundColor: '#2563EB' },
title: { fontSize: 28, fontWeight: 'bold', color: '#FFF', margin: 0 },
content: { padding: 24 },
avatarContainer: { alignItems: 'center', marginBottom: 24 },
avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center', display: 'flex' },
avatarText: { fontSize: 40, fontWeight: 'bold', color: '#FFF' },
infoCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
infoLabel: { fontSize: 16, color: '#6B7280' },
infoValue: { fontSize: 16, color: '#111827', fontWeight: 600 },
adminText: { color: '#2563EB' },
divider: { height: 1, backgroundColor: '#E5E7EB', margin: '16px 0' },
logoutButton: { backgroundColor: '#DC2626', borderRadius: 16, padding: '18px 24px', border: 'none', color: '#FFF', fontSize: 18, fontWeight: 600, cursor: 'pointer', width: '100%' },
};
