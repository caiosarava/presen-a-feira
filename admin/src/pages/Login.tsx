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
    <div className="min-h-screen bg-gradient-to-br from-surface via-surface-container to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary to-green-700 rounded-2xl shadow-2xl mb-6">
            <svg className="w-10 h-10 text-on-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">Precision Attendance</h1>
          <p className="text-on-surface-variant font-medium">Painel Administrativo</p>
        </div>

        {/* Card */}
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3"
                  placeholder="admin@exemplo.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">
                Senha
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v4h-4v4h4v4a2 2 0 002 2h2a2 2 0 002-2v-4h4v-4h-4z" />
                  </svg>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error-container border border-error rounded-xl flex items-start gap-3">
                <svg className="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-error font-semibold text-sm">Erro no login</p>
                  <p className="text-error text-sm">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Entrando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Entrar
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-outline-variant">
            <div className="bg-gradient-to-r from-green-50 to-green-100 -mx-4 -mb-4 p-4 rounded-xl">
              <p className="text-xs text-on-surface-variant text-center font-medium">
                <span className="text-secondary font-semibold">Credenciais de teste:</span>
                <br />
                admin@exemplo.com / sua-senha
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-on-surface-variant">
            Sistema de Gestão de Presença
          </p>
          <p className="text-xs text-outline-variant mt-1">
            © 2024 Precision Attendance. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
