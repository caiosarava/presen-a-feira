import { useState, useEffect } from 'react';
import { getLocations, createLocation, updateLocation, deleteLocation } from '../services/supabase';
import type { Location } from '../types';

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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
      const data = await getLocations();
      setLocations(data || []);
    } catch (error) {
      console.error('Error:', error);
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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Locais</h1>
            <p className="text-on-surface-variant">Gerencie os locais de registro de presença</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary hidden md:flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {showForm ? 'Cancelar' : 'Novo Local'}
          </button>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary md:hidden mt-4 w-full"
        >
          {showForm ? 'Cancelar' : 'Novo Local'}
        </button>
      </div>

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
              type="submit"
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
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Nome</th>
                <th className="text-left">Coordenadas</th>
                <th className="text-left">Raio</th>
                <th className="text-left hidden md:table-cell">Endereço</th>
                <th className="text-left">Status</th>
                <th className="text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr key={location.id}>
                  <td className="font-semibold text-primary">{location.name}</td>
                  <td className="text-on-surface-variant font-mono text-sm">
                    {location.latitude}, {location.longitude}
                  </td>
                  <td>
                    <span className="badge badge-blue">{location.radius_meters}m</span>
                  </td>
                  <td className="text-on-surface-variant text-sm hidden md:table-cell">
                    {location.address || 'Não informado'}
                  </td>
                  <td>
                    {location.active ? (
                      <span className="badge badge-green flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Ativo
                      </span>
                    ) : (
                      <span className="badge badge-red">Inativo</span>
                    )}
                  </td>
                  <td>
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
        {locations.length === 0 && (
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
