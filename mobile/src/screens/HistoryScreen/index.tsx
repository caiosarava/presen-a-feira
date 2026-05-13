import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { supabase } from '@/services/supabase';

export default function HistoryScreen() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadRecords(); }, []);

  const loadRecords = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('attendance_records').select('*, locations (name, address)').eq('user_id', user.id).order('check_in', { ascending: false }).limit(50);
      setRecords(data || []);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); setRefreshing(false); }
  };

  if (loading) return <View style={styles.centerContainer}><ActivityIndicator size="large" color="#2563EB" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historico</Text>
        <Text style={styles.subtitle}>Seus registros</Text>
      </View>
      {records.length === 0 ? (
        <View style={styles.emptyContainer}><Text style={styles.emptyText}>Nenhum registro encontrado</Text></View>
      ) : (
        <FlatList data={records} keyExtractor={(item) => item.id} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadRecords} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View><Text style={styles.cardDate}>{new Date(item.check_in).toLocaleDateString('pt-BR')}</Text><Text style={styles.cardLocation}>{item.locations?.name || 'Local'}</Text></View>
                <View style={styles.statusBadge}><Text style={styles.statusText}>{item.check_out ? 'Concluido' : 'Em andamento'}</Text></View>
              </View>
              <View style={styles.cardBody}><Text style={styles.timeText}>Entrada: {new Date(item.check_in).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} | Saida: {item.check_out ? new Date(item.check_out).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '-'}</Text></View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' },
  header: { padding: 24, paddingTop: 60, backgroundColor: '#2563EB' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  subtitle: { fontSize: 16, color: '#E0E7FF', marginTop: 4 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyText: { fontSize: 18, color: '#9CA3AF' },
  card: { backgroundColor: '#FFF', borderRadius: 12, marginHorizontal: 16, marginVertical: 8, overflow: 'hidden', elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  cardDate: { fontSize: 16, fontWeight: '600', color: '#111827' },
  cardLocation: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  statusBadge: { backgroundColor: '#DCF2F8', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, color: '#0E7490', fontWeight: '600' },
  cardBody: { padding: 16 },
  timeText: { fontSize: 14, color: '#6B7280' },
});
