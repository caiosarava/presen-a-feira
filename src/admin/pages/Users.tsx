import { useState, useEffect } from 'react';
import { supabase } from '../../shared/services/supabase';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

export default function Users() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: '', full_name: '', role: 'user' });

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase.from('profiles').update(formData).eq('id', editingId);
        if (error) throw error;
      } else {
        alert('Para criar usuários, utilize a autenticação do Supabase');
        return;
      }
      resetForm();
      loadUsers();
    } catch (error: any) {
      alert('Erro: ' + error.message);
    }
  };

  const handleEdit = (user: UserProfile) => {
    setFormData({ full_name: user.full_name || '', email: user.email || '', role: user.role || 'user' });
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este colaborador?')) {
      try {
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) throw error;
        loadUsers();
      } catch (error: any) {
        alert('Erro: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({ email: '', full_name: '', role: 'user' });
    setEditingId(null);
    setShowForm(false);
  };

  const getInitials = (name: string, email: string) =>
    name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
         : email?.charAt(0).toUpperCase() || 'U';

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <p className="font-body-sm text-body-sm text-on-surface-variant" style={{ marginTop: 16 }}>Carregando colaboradores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="font-headline-md text-headline-md text-primary" style={{ marginBottom: 4 }}>Gestão de Colaboradores</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Gerencie sua força de trabalho, cargos e acesso institucional.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: showForm ? 'var(--surface-container-lowest)' : 'var(--primary)',
              color: showForm ? 'var(--primary)' : 'var(--on-primary)',
              border: showForm ? '1px solid var(--outline)' : 'none',
              padding: '10px 20px', borderRadius: 8,
              fontFamily: 'Inter', fontWeight: 600, fontSize: 12, letterSpacing: '0.05em',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              {showForm ? 'close' : 'person_add'}
            </span>
            {showForm ? 'Cancelar' : 'Adicionar Novo Colaborador'}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'TOTAL DE COLABORADORES', value: users.length, icon: 'group', color: 'var(--primary)', bg: 'var(--primary-fixed)' },
          { label: 'ATIVOS', value: users.filter(u => u.role !== 'inactive').length, icon: 'how_to_reg', color: 'var(--secondary)', bg: 'rgba(0,108,73,0.1)' },
          { label: 'ADMINISTRADORES', value: users.filter(u => u.role === 'admin').length, icon: 'manage_accounts', color: 'var(--tertiary)', bg: 'var(--tertiary-fixed)' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: 'var(--surface-container-lowest)',
            borderRadius: 12, padding: 16,
            border: '1px solid var(--outline-variant)',
            display: 'flex', alignItems: 'center', gap: 16,
            boxShadow: '0 2px 8px rgba(0,30,64,0.06)',
          }}>
            <div style={{ background: stat.bg, color: stat.color, padding: 10, borderRadius: '50%', display: 'flex' }}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant">{stat.label}</p>
              <p className="font-headline-sm text-headline-sm" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="animate-fade-in" style={{
          background: 'var(--surface-container-lowest)',
          borderRadius: 12, padding: 24,
          border: '1px solid var(--outline-variant)',
          marginBottom: 24,
          boxShadow: '0 2px 8px rgba(0,30,64,0.06)',
        }}>
          <h2 className="font-headline-sm text-headline-sm text-primary" style={{ marginBottom: 24 }}>
            {editingId ? 'Editar Colaborador' : 'Cadastrar Novo Colaborador'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 16 }}>
            <div>
              <label className="font-label-bold text-label-bold text-on-surface-variant" style={{ display: 'block', marginBottom: 8 }}>Nome Completo</label>
              <input type="text" value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Ex: João Silva" />
            </div>
            <div>
              <label className="font-label-bold text-label-bold text-on-surface-variant" style={{ display: 'block', marginBottom: 8 }}>Email</label>
              <input type="email" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="exemplo@empresa.com" />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="font-label-bold text-label-bold text-on-surface-variant" style={{ display: 'block', marginBottom: 8 }}>Cargo / Função</label>
            <select className="select-arrow" value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="user">Colaborador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleSubmit} style={{
              background: 'var(--primary)', color: 'var(--on-primary)',
              padding: '10px 20px', borderRadius: 8, fontFamily: 'Inter', fontWeight: 600, fontSize: 12,
              letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
              {editingId ? 'Atualizar' : 'Cadastrar'}
            </button>
            <button onClick={resetForm} style={{
              background: 'var(--surface-container-lowest)', color: 'var(--on-surface)',
              border: '1px solid var(--outline-variant)',
              padding: '10px 20px', borderRadius: 8, fontFamily: 'Inter', fontWeight: 600, fontSize: 12,
              letterSpacing: '0.05em', cursor: 'pointer',
            }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{
        background: 'var(--surface-container-lowest)',
        borderRadius: 12,
        border: '1px solid var(--outline-variant)',
        boxShadow: '0 2px 8px rgba(0,30,64,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-container-low)', borderBottom: '1px solid var(--outline-variant)' }}>
                {['NOME', 'ID', 'CARGO', 'STATUS', 'AÇÕES'].map(h => (
                  <th key={h} style={{
                    padding: '12px 24px', textAlign: 'left',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                    color: 'var(--on-surface-variant)', fontFamily: 'Inter',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(195,198,209,0.3)', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-container-low)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '14px 24px', borderLeft: `4px solid ${user.role === 'admin' ? 'var(--tertiary-fixed-dim)' : 'var(--secondary)'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'var(--surface-container-high)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--primary)', fontWeight: 700, fontSize: 13,
                      }}>
                        {getInitials(user.full_name, user.email)}
                      </div>
                      <div>
                        <p className="font-body-md text-body-md text-primary" style={{ fontWeight: 700 }}>{user.full_name || 'Usuário'}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 24px' }}>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {user.id.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '14px 24px' }}>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {user.role === 'admin' ? 'Administrador' : 'Colaborador'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 24px' }}>
                    {user.role === 'admin' ? (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        background: 'var(--tertiary-fixed)', color: 'var(--tertiary)',
                        border: '1px solid var(--tertiary-fixed-dim)',
                        padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700,
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>shield</span>
                        Admin
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        background: 'rgba(0,108,73,0.1)', color: 'var(--secondary)',
                        border: '1px solid rgba(0,108,73,0.2)',
                        padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700,
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        Ativo
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 24px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => handleEdit(user)} style={{
                        padding: 6, borderRadius: 6, background: 'transparent',
                        color: 'var(--primary)', cursor: 'pointer', display: 'flex',
                        transition: 'background 0.15s',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-container)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>edit</span>
                      </button>
                      <button onClick={() => handleDelete(user.id)} style={{
                        padding: 6, borderRadius: 6, background: 'transparent',
                        color: 'var(--on-surface-variant)', cursor: 'pointer', display: 'flex',
                        transition: 'all 0.15s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--error-container)'; e.currentTarget.style.color = 'var(--error)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--on-surface-variant)'; }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>group</span>
            <p className="font-body-md text-body-md text-on-surface-variant" style={{ fontWeight: 600 }}>Nenhum colaborador cadastrado</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant" style={{ marginTop: 4 }}>Clique em "Adicionar Novo Colaborador" para começar</p>
          </div>
        )}

        {/* Pagination Footer */}
        {users.length > 0 && (
          <div style={{
            background: 'var(--surface-container-low)',
            padding: '12px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderTop: '1px solid var(--outline-variant)',
          }}>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Exibindo 1 a {users.length} de {users.length} registros
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button style={{
                padding: 4, border: '1px solid var(--outline-variant)',
                background: 'var(--surface-container-lowest)', borderRadius: 4,
                color: 'var(--on-surface-variant)', opacity: 0.5, cursor: 'default', display: 'flex',
              }}>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button style={{
                width: 32, height: 32, border: 'none',
                background: 'var(--primary)', color: 'var(--on-primary)',
                borderRadius: 4, fontFamily: 'Inter', fontWeight: 700, fontSize: 12, cursor: 'pointer',
              }}>1</button>
              <button style={{
                padding: 4, border: '1px solid var(--outline-variant)',
                background: 'var(--surface-container-lowest)', borderRadius: 4,
                color: 'var(--on-surface-variant)', opacity: 0.5, cursor: 'default', display: 'flex',
              }}>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
