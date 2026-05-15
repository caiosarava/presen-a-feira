import { useState } from 'react';
import { signIn } from '../../../shared/services/supabase';

export default function LoginScreen() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);

const handleLogin = async () => {
if (!email.trim() || !password.trim()) {
alert('Preencha todos os campos');
return;
}
setLoading(true);
try {
await signIn(email.trim(), password.trim());
} catch (error: any) {
alert('Erro no login: ' + (error.message || 'Nao foi possivel fazer login'));
} finally {
setLoading(false);
}
};

return (
<div style={styles.container}>
<div style={styles.content}>
<div style={styles.header}>
<h1 style={styles.title}>Presenca</h1>
<p style={styles.subtitle}>Registro de Ponto</p>
</div>
<div style={styles.form}>
<input
style={styles.input}
placeholder="E-mail"
value={email}
onChange={(e) => setEmail(e.target.value)}
autoCapitalize="none"
disabled={loading}
/>
<input
style={styles.input}
placeholder="Senha"
value={password}
onChange={(e) => setPassword(e.target.value)}
type="password"
disabled={loading}
/>
<button
style={{ ...styles.button, ...(loading && styles.buttonDisabled) }}
onClick={handleLogin}
disabled={loading}
>
{loading ? 'Entrando...' : 'Entrar'}
</button>
</div>
</div>
</div>
);
}

const styles: Record<string, React.CSSProperties> = {
container: { flex: 1, backgroundColor: '#F3F4F6', minHeight: '100vh', display: 'flex', justifyContent: 'center' },
content: { flex: 1, justifyContent: 'center', maxWidth: 400, width: '100%', padding: 24 },
header: { marginBottom: 48, alignItems: 'center', textAlign: 'center' },
title: { fontSize: 36, fontWeight: 'bold', color: '#2563EB', marginBottom: 8, margin: 0 },
subtitle: { fontSize: 18, color: '#6B7280', margin: 0 },
form: { gap: 16 },
input: { backgroundColor: '#FFF', borderRadius: 12, padding: '14px 16px', fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB', width: '100%', marginBottom: 8 },
button: { backgroundColor: '#2563EB', borderRadius: 12, padding: '16px 24px', alignItems: 'center', marginTop: 8, border: 'none', color: '#FFF', fontSize: 18, fontWeight: 600, cursor: 'pointer', width: '100%' },
buttonDisabled: { backgroundColor: '#93C5FD', cursor: 'not-allowed' },
};
