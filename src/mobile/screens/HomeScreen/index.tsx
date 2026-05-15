import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, Platform } from 'react-native';
import MapView, { Marker, Circle } from '../../components/MapView';
import { useLocation } from '../../hooks/useLocation';
import { supabase, checkIn, checkOut, getActiveSession } from '../../shared/services/supabase';
import { calculateDistance, formatDistance } from '../../utils/distance';
import type { Location as LocationType } from '../../shared/types';

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
    if (!position || !selectedLocation) { Alert.alert('Erro', 'Aguarde a localizacao'); return; }
    const canCheckIn = distance !== null && distance <= (selectedLocation.radius_meters || 100);
    if (!canCheckIn) { Alert.alert('Fora do alcance', `Voce esta a ${formatDistance(distance || 0)} do local.`); return; }
    setChecking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nao autenticado');
      if (activeSession) {
        await checkOut(activeSession.id, position.latitude, position.longitude);
        setActiveSession(null);
        Alert.alert('Sucesso', 'Saida registrada!');
      } else {
        await checkIn(user.id, selectedLocation.id, position.latitude, position.longitude, distance || 0);
        setActiveSession({ check_in: new Date().toISOString() });
        Alert.alert('Sucesso', 'Entrada registrada!');
      }
      loadData();
    } catch (error: any) { Alert.alert('Erro', error.message); }
    finally { setChecking(false); }
  };

  if (locationLoading || loading) return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#2563EB" />
      <Text style={styles.loadingText}>Carregando...</Text>
    </View>
  );

  const isInsideRadius = distance !== null && selectedLocation && distance <= (selectedLocation.radius_meters || 100);
  const isWeb = Platform.OS === 'web';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Presenca</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
        </View>

        {selectedLocation && (
          <View style={styles.mapContainer}>
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
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Local:</Text>
          <Text style={styles.infoValue}>{selectedLocation?.name || 'Carregando...'}</Text>
          
          {distance !== null && (
            <>
              <Text style={styles.infoLabel}>Distancia:</Text>
              <Text style={[styles.infoValue, isInsideRadius ? styles.insideRadius : styles.outsideRadius]}>
                {formatDistance(distance)} {isInsideRadius ? '✓' : '✗'}
              </Text>
            </>
          )}

          {activeSession && (
            <>
              <Text style={styles.infoLabel}>Check-in as:</Text>
              <Text style={styles.infoValue}>
                {new Date(activeSession.check_in).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </>
          )}

          {isWeb && (
            <View style={styles.webWarning}>
              <Text style={styles.webWarningText}>
                🌐 Para melhor experiencia, use um dispositivo movel
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, (!isInsideRadius || checking) && styles.buttonDisabled]}
          onPress={handleCheckAction}
          disabled={!isInsideRadius || checking}
        >
          {checking ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>
              {activeSession ? 'Registrar Saida' : 'Registrar Entrada'}
            </Text>
          )}
        </TouchableOpacity>

        {!isInsideRadius && (
          <Text style={styles.warningText}>Aproxime-se para registrar</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { flexGrow: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' },
  loadingText: { marginTop: 16, color: '#6B7280', fontSize: 16 },
  content: { padding: Platform.OS === 'web' ? 16 : 24 },
  header: { marginBottom: 24 },
  title: { fontSize: Platform.OS === 'web' ? 24 : 28, fontWeight: 'bold', color: '#111827' },
  date: { fontSize: 16, color: '#6B7280', marginTop: 4, textTransform: 'capitalize' },
  mapContainer: { height: Platform.OS === 'web' ? 300 : 250, borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  map: { width: '100%', height: '100%' },
  infoCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 24, elevation: 3 },
  infoLabel: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  infoValue: { fontSize: 18, color: '#111827', fontWeight: '600', marginBottom: 12 },
  insideRadius: { color: '#059669' },
  outsideRadius: { color: '#DC2626' },
  button: { backgroundColor: '#2563EB', borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginBottom: 16 },
  buttonDisabled: { backgroundColor: '#93C5FD' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  warningText: { textAlign: 'center', color: '#DC2626', fontSize: 14 },
  webWarning: { backgroundColor: '#EFF6FF', padding: 12, borderRadius: 8, marginTop: 8 },
  webWarningText: { color: '#2563EB', fontSize: 14, textAlign: 'center' },
});
