import { useState } from 'react';
import { signIn } from '../services/supabase';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 56,
            background: 'var(--primary)',
            borderRadius: 14, marginBottom: 20,
            boxShadow: '0 8px 24px rgba(0,30,64,0.2)',
          }}>
            <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v5l4.25 2.54.75-1.23-3.5-2.08V7z"/>
            </svg>
          </div>
          <h1 className="font-headline-md text-headline-md text-primary" style={{ marginBottom: 4 }}>Precision Attendance</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Painel Administrativo</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--surface-container-lowest)',
          borderRadius: 16,
          padding: 32,
          border: '1px solid var(--outline-variant)',
          boxShadow: '0 4px 24px rgba(0,30,64,0.08)',
        }}>
          <h2 className="font-headline-sm text-headline-sm text-primary" style={{ marginBottom: 24 }}>Entrar na sua conta</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label className="font-label-bold text-label-bold text-on-surface-variant" style={{ display: 'block', marginBottom: 8 }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined text-on-surface-variant" style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 20, pointerEvents: 'none',
                }}>mail</span>
                <input
                  type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@empresa.com"
                  required disabled={loading}
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="font-label-bold text-label-bold text-on-surface-variant" style={{ display: 'block', marginBottom: 8 }}>
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined text-on-surface-variant" style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 20, pointerEvents: 'none',
                }}>lock</span>
                <input
                  type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required disabled={loading}
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>

            {error && (
              <div style={{
                marginBottom: 16, padding: 14,
                background: 'var(--error-container)',
                border: '1px solid rgba(186,26,26,0.3)',
                borderRadius: 10,
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <span className="material-symbols-outlined text-error" style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>error</span>
                <div>
                  <p className="font-label-bold text-label-bold text-error">Erro no login</p>
                  <p className="font-body-sm text-body-sm text-error" style={{ marginTop: 2 }}>{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? 'var(--secondary-fixed-dim)' : 'var(--secondary)',
                color: 'var(--on-secondary)',
                padding: '14px 24px',
                borderRadius: 10,
                fontFamily: 'Inter', fontWeight: 700, fontSize: 14,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'all 0.2s',
                border: 'none',
              }}>
              {loading ? (
                <>
                  <div style={{
                    width: 18, height: 18,
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Entrando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>login</span>
                  Entrar
                </>
              )}
            </button>
          </form>

          <div style={{
            marginTop: 24, paddingTop: 20,
            borderTop: '1px solid var(--outline-variant)',
          }}>
            <div style={{
              background: 'var(--surface-container-low)',
              borderRadius: 8, padding: 12, textAlign: 'center',
            }}>
              <p className="font-label-bold text-label-bold text-on-surface-variant">
                Sistema de Gestão de Presença com Geofencing
              </p>
            </div>
          </div>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant" style={{ textAlign: 'center', marginTop: 24 }}>
          © 2024 Precision Attendance. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
