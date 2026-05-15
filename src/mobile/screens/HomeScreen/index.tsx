import { useState, useEffect } from 'react';
import { supabase, getActiveSession, checkIn, checkOut } from '../../../shared/services/supabase';
import { useLocation } from '../../hooks/useLocation';
import type { Location as LocationType } from '../../../shared/types';
import MapView, { Marker, Circle } from '../../components/MapView';
import { calculateDistance, formatDistance } from '../../utils/distance';

export default function HomeScreen() {
const { position, loading: locationLoading } = useLocation();
const [locations, setLocations] = useState<LocationType[]>([]);
const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);
const [activeSession, setActiveSession] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [checking, setChecking] = useState(false);
const [distance, setDistance] = useState<number | null>(null);

useEffect(() => { loadData(); }, []);
useEffect(() => { if (position && locations.length > 0) findNearestLocation(); }, [position, locations]);

const loadData = async () => {
try {
const { data: { user } } = await supabase.auth.getUser();
if (!user) return;
const { data: locs } = await supabase.from('locations').select('*').eq('active', true);
if (locs) setLocations(locs as LocationType[]);
const session = await getActiveSession(user.id);
setActiveSession(session);
} catch (error) { console.error('Error:', error); }
finally { setLoading(false); }
};

const findNearestLocation = () => {
if (!position || locations.length === 0) return;
let nearest: LocationType | null = null;
let minDistance = Infinity;
locations.forEach((loc) => {
const d = calculateDistance(position.latitude, position.longitude, parseFloat(loc.latitude.toString()), parseFloat(loc.longitude.toString()));
if (d < minDistance) { minDistance = d; nearest = loc; }
});
if (nearest) { setSelectedLocation(nearest); setDistance(minDistance); }
};

const handleCheckAction = async () => {
if (!position || !selectedLocation) { alert('Aguarde a localizacao'); return; }
const canCheckIn = distance !== null && distance <= (selectedLocation.radius_meters || 100);
if (!canCheckIn) { alert(`Voce esta a ${formatDistance(distance || 0)} de dist.`); return; }
setChecking(true);
try {
const { data: { user } } = await supabase.auth.getUser();
if (!user) throw new Error('Nao autenticado');
if (activeSession) {
await checkOut(activeSession.id, position.latitude, position.longitude);
setActiveSession(null);
alert('Sucesso! Saida registrada');
} else {
await checkIn(user.id, selectedLocation.id, position.latitude, position.longitude, distance || 0);
setActiveSession({ check_in: new Date().toISOString() });
alert('Sucesso! Entrada registrada');
}
loadData();
} catch (error: any) { alert('Erro: ' + error.message); }
finally { setChecking(false); }
};

if (locationLoading || loading) return (
<div style={styles.centerContainer}>
<div className="spinner"></div>
<p style={{ marginTop: 16, color: '#6B7280' }}>Carregando...</p>
</div>
);

const isInsideRadius = distance !== null && selectedLocation && distance <= (selectedLocation.radius_meters || 100);

return (
<div style={styles.container}>
<div style={styles.content}>
<div style={styles.header}>
<h1 style={styles.title}>Presenca</h1>
<p style={styles.date}>
{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
</p>
</div>

{selectedLocation && (
<div style={styles.mapContainer}>
<MapView
style={styles.map}
initialRegion={{
latitude: position?.latitude || selectedLocation.latitude,
longitude: position?.longitude || selectedLocation.longitude,
latitudeDelta: 0.01,
longitudeDelta: 0.01,
}}
showsUserLocation
followsUserLocation
>
<Circle
center={{ latitude: selectedLocation.latitude, longitude: selectedLocation.longitude }}
radius={selectedLocation.radius_meters || 100}
strokeColor="rgba(37, 99, 235, 0.3)"
fillColor="rgba(37, 99, 235, 0.1)"
/>
<Marker
coordinate={{ latitude: selectedLocation.latitude, longitude: selectedLocation.longitude }}
title={selectedLocation.name}
/>
</MapView>
</div>
)}

<div style={styles.infoCard}>
<p style={styles.infoLabel}>Local: <strong>{selectedLocation?.name || 'Carregando...'}</strong></p>

{distance !== null && (
<p style={isInsideRadius ? { ...styles.infoValue, ...styles.insideRadius } : { ...styles.infoValue, ...styles.outsideRadius }}>
Distancia: {formatDistance(distance)} {isInsideRadius ? '✓' : '✗'}
</p>
)}

{activeSession && (
<p style={styles.infoValue}>
Check-in as: {new Date(activeSession.check_in).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
</p>
)}
</div>

<button
style={{ ...styles.button, ...(!isInsideRadius || checking) && styles.buttonDisabled }}
onClick={handleCheckAction}
disabled={!isInsideRadius || checking}
>
{checking ? 'Carregando...' : activeSession ? 'Registrar Saida' : 'Registrar Entrada'}
</button>

{!isInsideRadius && (
<p style={styles.warningText}>Aproxime-se para registrar</p>
)}
</div>
</div>
);
}

const styles: Record<string, React.CSSProperties> = {
container: { flex: 1, backgroundColor: '#F3F4F6', minHeight: '100vh' },
content: { padding: 24 },
centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6', minHeight: '100vh' },
header: { marginBottom: 24 },
title: { fontSize: 28, fontWeight: 'bold', color: '#111827', margin: 0 },
date: { fontSize: 16, color: '#6B7280', marginTop: 4, textTransform: 'capitalize' as const },
mapContainer: { height: 300, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
map: { width: '100%', height: '100%' },
infoCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
infoLabel: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
infoValue: { fontSize: 18, color: '#111827', fontWeight: 600, marginBottom: 12 },
insideRadius: { color: '#059669' as const },
outsideRadius: { color: '#DC2626' as const },
button: { backgroundColor: '#2563EB', borderRadius: 16, padding: '18px 24px', border: 'none', color: '#FFF', fontSize: 18, fontWeight: 600, cursor: 'pointer', width: '100%' },
buttonDisabled: { backgroundColor: '#93C5FD', cursor: 'not-allowed' as const },
warningText: { textAlign: 'center' as const, color: '#DC2626', fontSize: 14, marginTop: 16 },
};
