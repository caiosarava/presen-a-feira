import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { supabase, signOut, getProfile } from '../../shared/services/supabase';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = { Login: undefined; Home: undefined; History: undefined; Profile: undefined };

export default function ProfileScreen({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'> }) {
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

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: async () => { try { await signOut(); navigation.replace('Login'); } catch { Alert.alert('Erro', 'Nao foi possivel sair'); } } },
    ]);
  };

  if (loading) return <View style={styles.centerContainer}><ActivityIndicator size="large" color="#2563EB" /></View>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Perfil</Text></View>
      <View style={styles.content}>
        <View style={styles.avatarContainer}><View style={styles.avatar}><Text style={styles.avatarText}>{profile?.name?.charAt(0)?.toUpperCase() || 'U'}</Text></View></View>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Nome:</Text><Text style={styles.infoValue}>{profile?.name || 'Nao informado'}</Text></View>
          <View style={styles.divider} />
          <View style={styles.infoRow}><Text style={styles.infoLabel}>E-mail:</Text><Text style={styles.infoValue}>{profile?.email || 'Nao informado'}</Text></View>
          <View style={styles.divider} />
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Tipo:</Text><Text style={[styles.infoValue, profile?.role === 'admin' && styles.adminText]}>{profile?.role === 'admin' ? 'Administrador' : 'Usuario'}</Text></View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}><Text style={styles.logoutButtonText}>Sair</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' },
  header: { padding: 24, paddingTop: 60, backgroundColor: '#2563EB' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  content: { padding: 24 },
  avatarContainer: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: '#FFF' },
  infoCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 24, elevation: 3 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { fontSize: 16, color: '#6B7280' },
  infoValue: { fontSize: 16, color: '#111827', fontWeight: '600' },
  adminText: { color: '#2563EB' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 16 },
  logoutButton: { backgroundColor: '#DC2626', borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  logoutButtonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
});
