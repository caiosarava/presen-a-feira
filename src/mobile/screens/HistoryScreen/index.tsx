import { useState, useEffect } from 'react';
import { supabase } from '../../../shared/services/supabase';

export default function HistoryScreen() {
const [records, setRecords] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => { loadRecords(); }, []);

const loadRecords = async () => {
try {
const { data: { user } } = await supabase.auth.getUser();
if (!user) return;
const { data } = await supabase.from('attendance_records').select('*, locations (name, address)').eq('user_id', user.id).order('check_in', { ascending: false }).limit(50);
setRecords(data || []);
} catch (error) { console.error('Error:', error); }
finally { setLoading(false); }
};

if (loading) return (
<div style={styles.centerContainer}>
<div className="spinner"></div>
</div>
);

return (
<div style={styles.container}>
<div style={styles.header}>
<h1 style={styles.title}>Historico</h1>
<p style={styles.subtitle}>Seus registros</p>
</div>
{records.length === 0 ? (
<div style={styles.emptyContainer}>
<p style={styles.emptyText}>Nenhum registro encontrado</p>
</div>
) : (
<div style={styles.list}>
{records.map((item) => (
<div key={item.id} style={styles.card}>
<div style={styles.cardHeader}>
<div>
<p style={styles.cardDate}>{new Date(item.check_in).toLocaleDateString('pt-BR')}</p>
<p style={styles.cardLocation}>{item.locations?.name || 'Local'}</p>
</div>
<div style={styles.statusBadge}>
<span style={styles.statusText}>{item.check_out ? 'Concluido' : 'Em andamento'}</span>
</div>
</div>
<div style={styles.cardBody}>
<p style={styles.timeText}>
Entrada: {new Date(item.check_in).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} | Saida: {item.check_out ? new Date(item.check_out).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '-'}
</p>
</div>
</div>
))}
</div>
)}
</div>
);
}

const styles: Record<string, React.CSSProperties> = {
container: { flex: 1, backgroundColor: '#F3F4F6', minHeight: '100vh' },
centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6', minHeight: '100vh' },
header: { padding: 24, paddingTop: 24, backgroundColor: '#2563EB' },
title: { fontSize: 28, fontWeight: 'bold', color: '#FFF', margin: 0 },
subtitle: { fontSize: 16, color: '#E0E7FF', marginTop: 4, marginBottom: 0 },
emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
emptyText: { fontSize: 18, color: '#9CA3AF' },
list: { padding: 16 },
card: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottom: '1px solid #F3F4F6' },
cardDate: { fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 },
cardLocation: { fontSize: 14, color: '#6B7280', marginTop: 2, marginBottom: 0 },
statusBadge: { backgroundColor: '#DCF2F8', padding: '4px 12px', borderRadius: 12 },
statusText: { fontSize: 12, color: '#0E7490', fontWeight: 600 },
cardBody: { padding: 16 },
timeText: { fontSize: 14, color: '#6B7280', margin: 0 },
};
