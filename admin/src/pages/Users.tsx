import { useState, useEffect } from 'react';
import { getUsers, updateUser } from '../services/supabase';
import type { Profile } from '../types';

export default function Users() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: '', role: 'user' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: Profile) => {
    setEditingId(user.id);
    setEditData({ name: user.name, role: user.role });
  };

  const handleSave = async () => {
    try {
      await updateUser(editingId!, editData);
      loadUsers();
      setEditingId(null);
    } catch (error: any) {
      alert('Erro: ' + error.message);
    }
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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Usuários</h1>
        <p className="text-on-surface-variant">Gerencie os usuários do sistema</p>
      </div>

      {/* Edit Form */}
      {editingId && (
        <div className="card mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-primary mb-6">Editar Usuário</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">Nome</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">Cargo</label>
              <select
                value={editData.role}
                onChange={(e) => setEditData({ ...editData, role: e.target.value as 'admin' | 'user' })}
                className="w-full"
              >
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="btn-primary">
              Salvar
            </button>
            <button onClick={() => setEditingId(null)} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Usuário</th>
                <th className="text-left">Email</th>
                <th className="text-left">Cargo</th>
                <th className="text-left hidden md:table-cell">Criado em</th>
                <th className="text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-secondary to-green-700 rounded-full flex items-center justify-center text-on-secondary font-bold flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-primary">{user.name}</span>
                    </div>
                  </td>
                  <td className="text-on-surface-variant">{user.email}</td>
                  <td>
                    {user.role === 'admin' ? (
                      <span className="badge badge-purple flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Administrador
                      </span>
                    ) : (
                      <span className="badge badge-blue">Usuário</span>
                    )}
                  </td>
                  <td className="text-on-surface-variant text-sm hidden md:table-cell">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-primary hover:text-primary-container p-2 hover:bg-primary-fixed rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="hidden md:inline">Editar</span>
                    </button>
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
            <p className="text-on-surface-variant font-medium">Nenhum usuário encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
