import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { signIn } from '@/services/supabase';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = { Login: undefined; Home: undefined; History: undefined; Profile: undefined };

export default function LoginScreen({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, 'Login'> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password.trim());
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Erro no login', error.message || 'Nao foi possivel fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Presenca</Text>
            <Text style={styles.subtitle}>Registro de Ponto</Text>
          </View>
          <View style={styles.form}>
            <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#9CA3AF" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" editable={!loading} />
            <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#9CA3AF" value={password} onChangeText={setPassword} secureTextEntry editable={!loading} />
            <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Entrar</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  header: { marginBottom: 48, alignItems: 'center' },
  title: { fontSize: 36, fontWeight: 'bold', color: '#2563EB', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#6B7280' },
  form: { gap: 16 },
  input: { backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  button: { backgroundColor: '#2563EB', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { backgroundColor: '#93C5FD' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
});
