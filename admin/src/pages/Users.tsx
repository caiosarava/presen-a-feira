import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

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
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'user',
  });

  useEffect(() => {
    loadUsers();
  }, []);

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
        const { error } = await supabase
          .from('profiles')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Note: Creating users should be done via Supabase Auth
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
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      role: user.role || 'user',
    });
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-on-surface-variant font-medium mt-4">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Colaboradores</h1>
            <p className="text-on-surface-variant">Gerencie os usuários do sistema</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {showForm ? 'Cancelar' : 'Novo Usuário'}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-2.02M21 21v-2a3 3 0 00-3-3h-1m-15 0a3 3 0 00-5.356 2.02M3 21v-2a3 3 0 003-3h1" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase">Total de Usuários</p>
            <p className="text-2xl font-bold text-primary">{users.length}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase">Ativos</p>
            <p className="text-2xl font-bold text-secondary">{users.filter(u => u.role !== 'inactive').length}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-tertiary-container/10 rounded-full flex items-center justify-center text-tertiary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase">Administradores</p>
            <p className="text-2xl font-bold text-tertiary">{users.filter(u => u.role === 'admin').length}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-primary mb-6">
            {editingId ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">Nome Completo</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full"
                placeholder="Ex: João Silva"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full"
                placeholder="exemplo@empresa.com"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Cargo/Função</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full"
              placeholder="Ex: Administrador"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-primary"
            >
              {editingId ? 'Atualizar Usuário' : 'Cadastrar Usuário'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container">
                <th className="text-left px-6 py-4">Nome</th>
                <th className="text-left px-6 py-4">Email</th>
                <th className="text-left px-6 py-4">Cargo</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">
                        {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </div>
                      <span className="font-semibold text-on-surface">{user.full_name || 'Usuário'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">{user.email}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{user.role || 'user'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${
                      user.role === 'admin' 
                        ? 'bg-tertiary-fixed text-tertiary' 
                        : 'bg-secondary/10 text-secondary'
                    }`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {user.role === 'admin' ? 'Admin' : 'Ativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-primary hover:text-primary-container p-2 hover:bg-primary-fixed rounded-lg transition-colors"
                        title="Editar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-error hover:text-error-container p-2 hover:bg-error-container/20 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-outline-variant mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-on-surface-variant font-medium">Nenhum usuário cadastrado</p>
            <p className="text-on-surface-variant text-sm mt-1">Clique em "Novo Usuário" para cadastrar</p>
          </div>
        )}
      </div>
    </div>
  );
}
