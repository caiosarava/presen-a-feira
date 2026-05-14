import { useState, useEffect } from 'react';
import { getLocations, createLocation, updateLocation, deleteLocation } from '../services/supabase';
import type { Location } from '../types';

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    radius_meters: '100',
    address: '',
    active: true,
  });

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setError(null);
      const data = await getLocations();
      console.log('Locations loaded:', data);
      setLocations(data || []);
    } catch (error: any) {
      console.error('Error loading locations:', error);
      setError(error.message || 'Erro ao carregar locais');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        radius_meters: parseInt(formData.radius_meters),
      };

      if (editingId) {
        await updateLocation(editingId, data);
      } else {
        await createLocation(data);
      }

      resetForm();
      loadLocations();
    } catch (error: any) {
      alert('Erro: ' + error.message);
    }
  };

  const handleEdit = (location: Location) => {
    setFormData({
      name: location.name,
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      radius_meters: location.radius_meters.toString(),
      address: location.address || '',
      active: location.active,
    });
    setEditingId(location.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este local?')) {
      try {
        await deleteLocation(id);
        loadLocations();
      } catch (error: any) {
        alert('Erro: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', latitude: '', longitude: '', radius_meters: '100', address: '', active: true });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-on-surface-variant font-medium mt-4">Carregando locais...</p>
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
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Locais</h1>
            <p className="text-on-surface-variant">Gerencie os locais de registro de presença</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {showForm ? 'Cancelar' : 'Novo Local'}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase">Total de Locais</p>
            <p className="text-2xl font-bold text-primary">{locations.length}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase">Locais Ativos</p>
            <p className="text-2xl font-bold text-secondary">{locations.filter(l => l.active).length}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-tertiary/10 rounded-full flex items-center justify-center text-tertiary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase">Raio Médio</p>
            <p className="text-2xl font-bold text-tertiary">
              {locations.length > 0 
                ? `${Math.round(locations.reduce((acc, l) => acc + l.radius_meters, 0) / locations.length)}m`
                : '0m'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-error-container border border-error rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-error font-semibold text-sm">Erro ao carregar</p>
            <p className="text-error text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="card mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-primary mb-6">
            {editingId ? 'Editar Local' : 'Cadastrar Novo Local'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">Nome do Local</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full"
                placeholder="Ex: Escritório Central"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">Raio de Alcance (metros)</label>
              <input
                type="number"
                value={formData.radius_meters}
                onChange={(e) => setFormData({ ...formData, radius_meters: e.target.value })}
                className="w-full"
                placeholder="100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                className="w-full"
                placeholder="-23.561414"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                className="w-full"
                placeholder="-46.655881"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Endereço Completo</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full"
              placeholder="Rua, Número, Cidade - Estado"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-5 h-5 text-secondary rounded focus:ring-secondary"
              />
              <span className="ml-3 text-sm font-medium text-on-surface">Local ativo e disponível para registros</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-primary"
            >
              {editingId ? 'Atualizar Local' : 'Cadastrar Local'}
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
                <th className="text-left px-6 py-4">Coordenadas</th>
                <th className="text-left px-6 py-4">Raio</th>
                <th className="text-left px-6 py-4 hidden md:table-cell">Endereço</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {locations.map((location) => (
                <tr key={location.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-primary">{location.name}</span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant font-mono text-sm">
                    {location.latitude}, {location.longitude}
                  </td>
                  <td className="px-6 py-4">
                    <span className="badge badge-blue">{location.radius_meters}m</span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant text-sm hidden md:table-cell">
                    {location.address || 'Não informado'}
                  </td>
                  <td className="px-6 py-4">
                    {location.active ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-secondary/10 text-secondary">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-error/10 text-error">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Inativo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(location)}
                        className="text-primary hover:text-primary-container p-2 hover:bg-primary-fixed rounded-lg transition-colors"
                        title="Editar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(location.id)}
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

        {locations.length === 0 && !error && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-outline-variant mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-on-surface-variant font-medium">Nenhum local cadastrado</p>
            <p className="text-on-surface-variant text-sm mt-1">Clique em "Novo Local" para cadastrar</p>
          </div>
        )}
      </div>
    </div>
  );
}
