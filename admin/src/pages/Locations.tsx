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
    name: '', latitude: '', longitude: '',
    radius_meters: '100', address: '', active: true,
  });

  useEffect(() => { loadLocations(); }, []);

  const loadLocations = async () => {
    try {
      setError(null);
      const data = await getLocations();
      setLocations(data || []);
    } catch (error: any) {
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

  const avgRadius = locations.length > 0
    ? Math.round(locations.reduce((acc, l) => acc + l.radius_meters, 0) / locations.length)
    : 0;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <p className="font-body-sm text-body-sm text-on-surface-variant" style={{ marginTop: 16 }}>Carregando locais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="font-headline-md text-headline-md text-primary" style={{ marginBottom: 4 }}>Configurações de Localização</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Gerencie os perímetros físicos onde os colaboradores podem registrar o ponto.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: showForm ? 'var(--surface-container-lowest)' : 'var(--primary)',
            color: showForm ? 'var(--primary)' : 'var(--on-primary)',
            border: showForm ? '1px solid var(--outline)' : 'none',
            padding: '10px 20px', borderRadius: 12,
            fontFamily: 'Inter', fontWeight: 600, fontSize: 12, letterSpacing: '0.05em',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            {showForm ? 'close' : 'add_location_alt'}
          </span>
          {showForm ? 'Cancelar' : 'Adicionar Novo Local'}
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'TOTAL DE LOCAIS', value: locations.length, icon: 'location_on', color: 'var(--primary)', bg: 'var(--primary-fixed)' },
          { label: 'LOCAIS ATIVOS', value: locations.filter(l => l.active).length, icon: 'verified_user', color: 'var(--secondary)', bg: 'rgba(0,108,73,0.1)' },
          { label: 'RAIO MÉDIO', value: `${avgRadius}m`, icon: 'radar', color: 'var(--tertiary)', bg: 'var(--tertiary-fixed)' },
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

      {/* Error */}
      {error && (
        <div style={{
          marginBottom: 16, padding: 16,
          background: 'var(--error-container)', border: '1px solid var(--error)',
          borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span className="material-symbols-outlined text-error">error</span>
          <div>
            <p className="font-label-bold text-label-bold text-error">Erro ao carregar</p>
            <p className="font-body-sm text-body-sm text-error">{error}</p>
          </div>
        </div>
      )}

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
            {editingId ? 'Editar Local' : 'Cadastrar Novo Local'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 16 }}>
            <div>
              <label className="font-label-bold text-label-bold text-on-surface-variant" style={{ display: 'block', marginBottom: 8 }}>Nome do Local</label>
              <input type="text" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Escritório Central" />
            </div>
            <div>
              <label className="font-label-bold text-label-bold text-on-surface-variant" style={{ display: 'block', marginBottom: 8 }}>Raio de Alcance (metros)</label>
              <input type="number" value={formData.radius_meters}
                onChange={(e) => setFormData({ ...formData, radius_meters: e.target.value })}
                placeholder="100" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 16 }}>
            <div>
              <label className="font-label-bold text-label-bold text-on-surface-variant" style={{ display: 'block', marginBottom: 8 }}>Latitude</label>
              <input type="number" step="any" value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="-23.561414" />
            </div>
            <div>
              <label className="font-label-bold text-label-bold text-on-surface-variant" style={{ display: 'block', marginBottom: 8 }}>Longitude</label>
              <input type="number" step="any" value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="-46.655881" />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="font-label-bold text-label-bold text-on-surface-variant" style={{ display: 'block', marginBottom: 8 }}>Endereço Completo</label>
            <input type="text" value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Rua, Número, Cidade - Estado" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                style={{ width: 18, height: 18, minHeight: 18, accentColor: 'var(--secondary)', cursor: 'pointer' }} />
              <span className="font-body-sm text-body-sm text-on-surface">Local ativo e disponível para registros</span>
            </label>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleSubmit} style={{
              background: 'var(--primary)', color: 'var(--on-primary)',
              padding: '10px 20px', borderRadius: 8, fontFamily: 'Inter', fontWeight: 600, fontSize: 12,
              letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
              {editingId ? 'Atualizar Local' : 'Cadastrar Local'}
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

      {/* Location Cards + Table Toggle */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 24 }}>
        {locations.map((location) => (
          <div key={location.id} style={{
            background: 'var(--surface-container-lowest)',
            borderRadius: 12,
            border: '1px solid rgba(195,198,209,0.3)',
            borderLeft: `4px solid ${location.active ? 'var(--secondary)' : 'var(--outline-variant)'}`,
            padding: 20,
            boxShadow: '0 2px 8px rgba(0,30,64,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flex: 1 }}>
              <div style={{
                background: location.active ? 'rgba(0,108,73,0.1)' : 'var(--surface-container)',
                color: location.active ? 'var(--secondary)' : 'var(--on-surface-variant)',
                padding: 10, borderRadius: '50%', display: 'flex', flexShrink: 0,
              }}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {location.active ? 'verified_user' : 'location_off'}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">{location.name}</h3>
                  <span style={{
                    background: location.active ? 'var(--secondary-container)' : 'var(--surface-container-highest)',
                    color: location.active ? 'var(--on-secondary-container)' : 'var(--on-surface-variant)',
                    padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
                  }}>
                    {location.active ? 'ATIVO' : 'INATIVO'}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant" style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>place</span>
                  {location.address || `${location.latitude}, ${location.longitude}`}
                </p>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant" style={{ display: 'block', marginBottom: 2 }}>RAIO</span>
                    <span className="font-label-bold text-label-bold text-on-surface">{location.radius_meters} Metros</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant" style={{ display: 'block', marginBottom: 2 }}>COORDENADAS</span>
                    <span className="font-label-bold text-label-bold text-on-surface" style={{ fontFamily: 'monospace', fontSize: 11 }}>
                      {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <button onClick={() => handleEdit(location)} style={{
                padding: 8, borderRadius: 6, background: 'transparent',
                color: 'var(--primary)', cursor: 'pointer', display: 'flex',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-container)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button onClick={() => handleDelete(location.id)} style={{
                padding: 8, borderRadius: 6, background: 'transparent',
                color: 'var(--on-surface-variant)', cursor: 'pointer', display: 'flex',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--error-container)'; e.currentTarget.style.color = 'var(--error)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--on-surface-variant)'; }}>
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {locations.length === 0 && !error && (
        <div style={{
          background: 'var(--surface-container-lowest)',
          borderRadius: 12, padding: 48,
          border: '1px solid var(--outline-variant)',
          textAlign: 'center',
        }}>
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>add_location_alt</span>
          <p className="font-body-md text-body-md text-on-surface-variant" style={{ fontWeight: 600 }}>Nenhum local cadastrado</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant" style={{ marginTop: 4 }}>Clique em "Adicionar Novo Local" para começar</p>
        </div>
      )}

      {/* Settings Info Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 24 }}>
        {[
          { icon: 'security_update_good', color: 'var(--primary)', title: 'Nível de Precisão', desc: 'Rastreamento GPS de alta precisão obrigatório. Sinal mínimo de -80dBm para check-in válido.' },
          { icon: 'gpp_good', color: 'var(--secondary)', title: 'Alcance Global', desc: 'Soft-fencing permitido para equipes externas com logs de exceção aprovados pelo gestor.' },
          { icon: 'report', color: 'var(--error)', title: 'Limites de Alerta', desc: 'Alertas em tempo real disparados após 3 falhas em tentativas fora das zonas do perímetro.' },
        ].map((info) => (
          <div key={info.title} style={{
            background: 'var(--surface-container-low)',
            borderRadius: 12, padding: 20,
            border: '1px solid rgba(195,198,209,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span className="material-symbols-outlined" style={{ color: info.color }}>{info.icon}</span>
              <h4 className="font-headline-sm text-headline-sm" style={{ color: info.color }}>{info.title}</h4>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{info.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
